import * as net from "net";

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// Uncomment this to pass the first stage
const server = net.createServer((socket) => {
  socket.on("close", () => {
    socket.end();
  });

  socket.on("data", (req: Buffer) => {
    const reqS = req.toString();
    const path: string = reqS.split(" ")[1];
    console.log(path);
    let res = "";

    if (path === "/") {
      res = "HTTP/1.1 200 OK\r\n\r\n";
    } else if (path.startsWith("/echo/")) {
      let tmp = path.split("/")[2];
      res = `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${tmp.length}\r\n\r\n${tmp}`;
    } else {
      res = "HTTP/1.1 404 Not Found\r\n\r\n";
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
