import { createServer, IncomingMessage, Server, ServerResponse } from "http";
import net from "net";

export interface CallbackResponse {
  data?: any;
}

export interface CallbackServerConfig {
  timeout?: number;
}

export class CallbackServer {
  private server: Server | null = null;
  private port: number;
  private timeoutId?: NodeJS.Timeout;
  private promiseResolve?: (value: CallbackResponse) => void;
  private promiseReject?: (reason: any) => void;

  constructor(port = 9221) {
    this.port = port;
  }

  getPort(): number {
    return this.port;
  }

  private async findAvailablePort(startPort: number, maxAttempts = 10): Promise<number> {
    for (let i = 0; i < maxAttempts; i++) {
      const port = startPort + i;
      if (await this.isPortAvailable(port)) {
        return port;
      }
    }
    throw new Error(`No available port found in range ${startPort}-${startPort + maxAttempts - 1}`);
  }

  private parseBody(req: IncomingMessage): Promise<string> {
    return new Promise((resolve) => {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });
      req.on("end", () => {
        resolve(body);
      });
    });
  }

  private handleRequest = async (req: IncomingMessage, res: ServerResponse) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
      res.writeHead(200);
      res.end();
      return;
    }

    if (req.method === "POST" && req.url === "/data") {
      const body = await this.parseBody(req);
      
      if (this.promiseResolve) {
        if (this.timeoutId) clearTimeout(this.timeoutId);
        
        this.promiseResolve({ data: body });
        this.shutdown();

        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end("success");
      } else {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Server not ready");
      }
      return;
    }

    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not found");
  };

  private async shutdown(): Promise<void> {
    if (this.server) {
      this.server.close();
      this.server = null;
    }
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  private isPortAvailable(port: number): Promise<boolean> {
    return new Promise((resolve) => {
      const tester = net
        .createServer()
        .once("error", () => resolve(false))
        .once("listening", () => {
          tester.close();
          resolve(true);
        })
        .listen(port, "127.0.0.1");
    });
  }

  async waitForCallback(config: CallbackServerConfig = {}): Promise<CallbackResponse> {
    const { timeout = 600000 } = config;

    try {
      this.port = await this.findAvailablePort(this.port);

      this.server = createServer(this.handleRequest);
      this.server.listen(this.port, "127.0.0.1");

      return new Promise<CallbackResponse>((resolve, reject) => {
        this.promiseResolve = resolve;
        this.promiseReject = reject;

        if (!this.server) {
          reject(new Error("Failed to start server"));
          return;
        }

        this.server.on("error", (error) => {
          if (this.promiseReject) this.promiseReject(error);
        });

        this.timeoutId = setTimeout(() => {
          resolve({ data: { timedOut: true } });
          this.shutdown();
        }, timeout);

        console.log(`Callback server listening on http://127.0.0.1:${this.port}/data`);
      });
    } catch (error) {
      await this.shutdown();
      throw error;
    }
  }
}
