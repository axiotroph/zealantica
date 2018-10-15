function write(writer, prefix, severity, content) {
  console.log('[' + prefix + '][' + writer.name + ']: ' + content);
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
