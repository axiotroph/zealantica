let logData = [];

export function logText(){
  return logData.join("\n");
}

function write(writer, prefix, severity, content, raw) {
  let str = '[' + prefix + '][' + writer.name + ']: ' + content;
  console.log(str);

  if(severity <= 2 || raw){
    if(raw){
      logData.push(content);
    }else{
      logData.push(str);
    }

    while(logData.length > 20){
      logData.shift();
    }
  }
}

class LogWriter {
  constructor(name) {
    this.name = name;
  }

  trace(msg) {
    write(this, 'trace', 5, msg);
  }

  debug(msg) {
    write(this, 'debug', 4, msg);
  }

  info(msg) {
    write(this, 'info', 3, msg);
  }

  user(msg){
    write(this, 'user', 3, msg, true);
  }

  warn(msg) {
    write(this, 'WARN', 2, msg);
  }

  error(msg) {
    write(this, 'ERROR', 1, msg);
  }

  fatal(msg) {
    write(this, 'FATAL', 0, msg);
  }
}

export default function get(name) {
  return new LogWriter(name);
}
