class Logger {
    static log(message: string): void {
      console.log(`[INFO]: ${new Date().toISOString()} - ${message}`);
    }
  
    static warn(message: string): void {
      console.warn(`[WARN]: ${new Date().toISOString()} - ${message}`);
    }
  
    static error(message: string): void {
      console.error(`[ERROR]: ${new Date().toISOString()} - ${message}`);
    }
  
    static debug(message: string): void {
      if (process.env.NODE_ENV === 'development') {
        console.debug(`[DEBUG]: ${new Date().toISOString()} - ${message}`);
      }
    }
  }
  
  export default Logger;
  