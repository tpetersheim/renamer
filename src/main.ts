import fs = require('fs');
import yargs from 'yargs';
import { Logger } from './Logger';
// import { nameof } from './nameof';

class Main {

  private logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  public run() {
    const args = yargs.argv;
    const fileRenamesJsonArg = args.fileRenames || '../data/test.json';
    const folderNameArg = args.folder || '../data/files';

    if (!this.checkArgs(fileRenamesJsonArg, folderNameArg)) {
      return;
    }

    const fileRenames = fs.readFileSync(fileRenamesJsonArg).toJSON();
    this.logger.log(JSON.stringify(fileRenames));

    const existingFileNames = fs.readdirSync(folderNameArg);
    this.logger.log(JSON.stringify(existingFileNames));

  }

  private checkArgs(fileRenamesJsonArg: string, folderNameArg: string): boolean {
    if (fileRenamesJsonArg == null || !fs.existsSync(fileRenamesJsonArg)) {
      this.logger.error(`fileRenamesJsonArg value '${fileRenamesJsonArg}' argument does not exist`);
      return false;
    }

    if (folderNameArg == null || !fs.existsSync(folderNameArg)) {
      this.logger.error(`folderNameArg value '${folderNameArg}' argument does not exist`);
      return false;
    }

    return true;
  }
}

new Main(new Logger()).run();
