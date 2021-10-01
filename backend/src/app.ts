import express, { Application } from 'express';

class App {

    app: Application;

    constructor() {

        this.app = express();
    }

    private checkPortRange(PORT: number, callback: (err: Error | null) => void): void {

        const outOfRange = PORT >= 1024 && PORT <= 49151;
        
        outOfRange ?
            callback(new Error("(PORT) PARAM IS OUTSIDE OF THE PORT RANGE 1024~49151"))
        : 
            callback(null);
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