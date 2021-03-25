import { image_search } from "duckduckgo-images-api";
import PromisePool from "es6-promise-pool";
import gm from "gm";
import got from "got";
import _ from "lodash";
// @ts-expect-error
import smartcrop from "smartcrop-gm";
import { log } from "../../pkg/services/log";

/**
 * ImageMagick
 */
const im = gm.subClass({ imageMagick: true });

/**
 * Get a picture from DuckDuckGo and do a smart crop.
 * @param query the search terms used by duckduckgo
 * @param width the target width of the image
 * @param height the target height of the image
 * @param n the number of images to download and analyze. You are limited by the memory size as well as your bandwidth.
 * @returns a JPEG image in a `Buffer`.
 */
export async function generatePicture(
  query: string,
  width: number = 500,
  height: number = 500,
  n: number = 15
) {
  let images = await image_search({
    query,
    iterations: 3,
    moderate: true,
    retries: 2,
  });

  // filter images so that they all have the correct width
  const imageURLs = _.sampleSize(images, n)
    .filter((img) => img.width >= width && img.height >= height)
    .map((img) => img.image);

  const pool = new PromisePool(() => {
    if (imageURLs.length === 0) {
      return;
    }

    return (async () => {
      const url = imageURLs.pop()!;

      try {
        var resp = await got(url, {
          responseType: "buffer",
          timeout: 15000,
        });
      } catch (err) {
        log.error("got error while downloading image", {
          err,
          url,
        });
        return null;
      }

      try {
        var result = await smartcrop.crop(resp.body, {
          width,
          height,
        });
      } catch (err) {
        if (
          err.toString().includes("no decode delegate for this image format")
        ) {
          log.error("image format error", {
            err,
            url,
          });
          return null;
        }
      }

      const crop = result.topCrop;

      const buf = await new Promise<Buffer>((resolve) => {
        im(resp.body)
          .crop(crop.width, crop.height, crop.x, crop.y)
          .resize(width, height)
          .toBuffer("JPEG", (err, buf) => {
            if (err) {
              throw new Error("ImageMagick error: " + err);
            }

            resolve(buf);
          });
      });

      return {
        score: crop.score.total,
        buf,
      };
    })();
  }, 3);

  let bestImage = {
    score: -1,
    buf: Buffer.from(""),
  };

  pool.addEventListener("fulfilled", function (event) {
    // The event contains:
    // - target:    the PromisePool itself
    // - data:
    //   - promise: the Promise that got fulfilled
    //   - result:  the result of that Promise

    log.debug("profile picture cropping fullfilled");
    // @ts-expect-error
    const result = event.data.result;

    if (!result) {
      return;
    }

    if (result.score > bestImage.score) {
      bestImage = result;
    }
  });

  pool.addEventListener("rejected", function (event) {
    // The event contains:
    // - target:    the PromisePool itself
    // - data:
    //   - promise: the Promise that got rejected
    //   - error:   the Error for the rejection
    // @ts-expect-error
    log.error("PP cropping rejected: " + event.data.error.message);
  });

  await new Promise((resolve) => {
    pool.start().then(resolve, log.error);
  });

  if (bestImage.score === -1) {
    throw new Error("no pp image found");
  }

  log.info("created a profile picture image", {
    score: bestImage.score,
  });

  return bestImage.buf;
}
