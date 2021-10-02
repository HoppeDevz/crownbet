import Param from '../types/Param';

class ParamsController {
    

    private checkRule(paramName: string, param: any, rule: string | number, value: any): Error | undefined {

        switch(rule) {

            case "minStrLen":
                if ( param.length < value ) {

                    return new Error(`Param '${paramName}' must have at least ${value} characters`);
                }
            
            case "strPattern":
                switch(value) {
                    case "email":
                        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                        const isEmail = re.test(String(param).toLowerCase());
                        
                        if (!isEmail) {

                            return new Error(`Param '${paramName}' is invalid e-mail!`);
                        }
                }
        }
    }

    public requireParams(params: Array<Param>, callback: (err: Error | undefined) => void) {

        let err;

        for (let { paramName, param } of params) {

            param == null ? err = new Error(`Param '${paramName}' is null!`) : null;
        }

        callback(err);
    }

    public requireParamsType(params: Array<Param>, callback: (err: Error | undefined) => void) {

        let err;

        for (let { paramName, param, paramType, rules } of params) {

            const t = typeof(param);

            if (t != paramType) {

                err = new Error(`Type of ${paramName} is ${t} but expected ${paramType}`);
            }

            if (rules) {

                for (let [rule, value] of rules) {

                    const error = this.checkRule(paramName, param, rule, value);
                    error ? err = error : null;
                }
            }
            
        }

        callback(err);
    }
}

export default new ParamsController();