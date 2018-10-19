export class Logger {
  public log(...messages: any[]) {
    console.log(...messages);
  }

  public error(...messages: any[]) {
    console.error(...messages);
  }
}
