import fs from 'fs';
import yargs from 'yargs';

// /**
//  * Some predefined delays (in milliseconds).
//  */
// export enum Delays {
//   Short = 500,
//   Medium = 2000,
//   Long = 5000,
// }

// /**
//  * Returns a Promise<string> that resolves after given time.
//  *
//  * @param {string} name - A name.
//  * @param {number=} [delay=Delays.Medium] - Number of milliseconds to delay resolution of the Promise.
//  * @returns {Promise<string>}
//  */
// function delayedHello(name: string, delay: number = Delays.Medium): Promise<string> {
//   return new Promise(
//     (resolve: (value?: string) => void) => setTimeout(
//       () => resolve(`Hello, ${name}`),
//       delay,
//     ),
//   );
// }

// // Below are examples of using TSLint errors suppression
// // Here it is suppressing missing type definitions for greeter function

// export async function greeter(name) { // tslint:disable-line typedef
//   // tslint:disable-next-line no-unsafe-any no-return-await
//   return await delayedHello(name, Delays.Long);
// }

class Main {

  // constructor()
  // {

  // }

  public static Start() {
    const args = yargs.argv;
    const fileRenamesJsonArg = args.fileRenames;
    const folderNameArg = args.folder;

    const fileRenames = fs.readFileSync(fileRenamesJsonArg).toJSON();
    Logger.Log(JSON.stringify(fileRenames));

    const existingFileNames = fs.readdirSync(folderNameArg);
    Logger.Log(JSON.stringify(existingFileNames));

  }
}

Main.Start();

class Logger {

  public static Log(message: string) {
    console.log(message);
  }

  public static Error(message: string) {
    console.error(message);
  }
}
