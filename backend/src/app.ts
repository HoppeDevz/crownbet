import express, { Application, Router } from 'express';
import router from './router';
import cors from 'cors';

class App {

    app: Application;
    router: Router;

    constructor() {

        this.app = express();
        this.router = router;


        /* START */
        this.useCors();
        this.useContentTypeJSON();
        this.useRoutes();
    }

    private checkPortRange(PORT: number, callback: (err: Error | null) => void): void {

        const outOfRange = PORT < 1024 && PORT > 49151;
        
        outOfRange ?
            callback(new Error("(PORT) PARAM IS OUTSIDE OF THE PORT RANGE 1024~49151"))
        : 
            callback(null);
    }

    private useContentTypeJSON() {

        this.app.use(express.json());
    }

    private useRoutes() {

        this.app.use(this.router);
    }

    private useCors() {

        this.app.use(cors({
            origin: "*"
        }));
    }

    public startServer(PORT: number): void {

        this.checkPortRange(PORT, err => {

            if (err) throw err;

            this.app.listen(PORT, () => {
        
                console.log(`Server is running in port: ${PORT}`);
            });
        });
    }
}

export default new App();