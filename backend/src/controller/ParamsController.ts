import Param from '../types/Param';

class ParamsController {

    public requireParams(params: Array<Param>, callback: (err: Error | undefined) => void) {

        let err;

        for (let { paramName, param } of params) {

            param == null ? err = new Error(`Param '${paramName}' is null!`) : null;
        }

        callback(err);
    }

    public requireParamsType(params: Array<Param>, callback: (err: Error | undefined) => void) {

        let err;

        for (let { paramName, param, paramType } of params) {

            const t = typeof(param);

            if (t != paramType) {

                err = new Error(`Type of ${paramName} is ${t} but expected ${paramType}`);
            }
        }

        callback(err);
    }
}

export default new ParamsController();