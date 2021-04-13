import { Command } from "@oclif/command";

export default class Hello extends Command {
  static description = "start here ;)";

  static examples = [];

  static flags = {};

  static args = [{ name: "file" }];

  async run() {
    const { args, flags } = this.parse(Hello);

    console.log(args, flags);
  }
}
