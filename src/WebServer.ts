import express from "express";
import {Express} from "express";
import bodyParser from "body-parser";
import {ExpressRequest, Handler} from "./Handler";
import YAML from "yamljs";
import swaggerUi from "swagger-ui-express";
import cors from "cors";

const swaggerDocument = YAML.load('./openapi.yaml');

export class WebServer {
    private readonly webServer: Express;
    private defaultHandler?: Handler<ExpressRequest, void>;
    constructor(){
        this.webServer = express();
        this.webServer.use(cors());
        this.webServer.use(bodyParser.json({
            limit: "50mb"
        }));
        this.webServer.use(express.json())
        this.webServer.use(express.static("public"))
        this.webServer.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
    }

    addHandler(method: string, url: string, handler: Handler<ExpressRequest, void>): void {
        this.webServer.use(url, async (req, res, next) => {
            if (req.method !== method) {
                next();
                return;
            }
            await handler({
                rawRequest: req,
                rawResponse: res
            });
        });
    }

    startServer(port: number): void{
        const defaultHandler = this.defaultHandler;
        if (defaultHandler) {
            this.webServer.use(async (req, res) => {
                await defaultHandler({
                    rawRequest: req,
                    rawResponse: res
                });
            });
        }
            this.webServer.listen(port)
    }
}