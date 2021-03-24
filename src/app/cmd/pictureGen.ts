import terminalImage from "terminal-image";
import { generatePicture } from "../modules/pictureGenerator";

(async () => {
  const buf = await generatePicture("megumin wallpaper", 1240, 260, 30);
  console.log(
    await terminalImage.buffer(buf, {
      preserveAspectRatio: false,
      width: 124,
      height: 26,
    })
  );
})();
