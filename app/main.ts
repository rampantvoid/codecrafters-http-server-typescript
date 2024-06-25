import * as net from "net";
import { devNull } from "os";

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

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

// Uncomment this to pass the first stage
const server = net.createServer((socket) => {
  socket.on("close", () => {
    socket.end();
  });

  socket.on("data", (req: Buffer) => {
    const pathVar = usePathVariable(req, "echo/");
    let res = "";

    if (pathVar === "/") {
      res = "HTTP/1.1 200 OK\r\n\r\n";
    } else if (pathVar === null) {
      res = "HTTP/1.1 404 Not Found\r\n\r\n";
    } else {
      res = `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${pathVar.length}\r\n\r\n${pathVar}`;
    }

    // const res =
    //   path === "/"
    //     ? "HTTP/1.1 200 OK\r\n\r\n"
    //     : "HTTP/1.1 404 Not Found\r\n\r\n";
    socket.write(res);
    socket.end();
  });

  // socket.write("HTTP/1.1 200 OK\r\n\r\n");
  // socket.pipe(socket);
});

server.listen(4221, "localhost");
