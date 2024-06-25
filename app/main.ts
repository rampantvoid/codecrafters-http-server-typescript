import * as net from "net";
import { devNull } from "os";

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

interface ParsedRequest {
  method: string;
  path: string;
  httpVersion: string;
  headers: Record<string, string>;
  body?: string;
}

const usePathVariable = (req: Buffer, path: string) => {
  const reqPath = req.toString().split(" ")[1];
  if (reqPath === "/") return "/";
  if (reqPath.includes(path)) {
    const pathVar = reqPath.substring(reqPath.lastIndexOf(path) + path.length);
    return pathVar;
  } else {
    return null;
  }
};

const parseHttpRequest = (request: string | Buffer): ParsedRequest => {
  const requestString =
    request instanceof Buffer ? request.toString() : request;
  const [requestLine, ...rest] = requestString.split("\r\n");
  const [method, path, httpVersion] = requestLine.split(" ");

  const headers: Record<string, string> = {};
  let bodyStartIndex = -1;

  for (let i = 0; i < rest.length; i++) {
    if (rest[i] === "") {
      bodyStartIndex = i + 1;
      break;
    }

    const [key, value] = rest[i].split(": ");
    headers[key] = value;
  }

  const body =
    bodyStartIndex !== -1 ? rest.slice(bodyStartIndex).join("\r\n") : undefined;

  return {
    method,
    path,
    httpVersion,
    headers,
    body,
  };
};

// Uncomment this to pass the first stage
const server = net.createServer((socket) => {
  socket.on("close", () => {
    socket.end();
  });

  socket.on("data", (req: Buffer) => {
    const { path, headers } = parseHttpRequest(req);
    console.log(path);
    switch (path) {
      case "/":
        socket.write("HTTP/1.1 200 OK\r\n\r\n");
        socket.end();
        break;

      case "/echo":
        const message = path.split("/")[2];
        socket.write(
          `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${message.length}\r\n\r\n${message}`
        );
        break;

      case "/user-agent":
        const headerContent = headers["User-Agent"];

        if (headerContent != undefined) {
          socket.write(
            `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${headerContent.length}\r\n\r\n${headerContent}`
          );
          socket.end();
        }
        break;

      default:
        socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
        socket.end();
    }
  });
});

server.listen(4221, "localhost");
