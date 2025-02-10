export const getErrorMessage = (error, msg = 'Unknow error') => {
    if (typeof error === 'string') return error;

    if (error instanceof Array) {
        let objErr = {};
        error.forEach((err) => {
            objErr[err.key] = err.msg;
        });
        return JSON.stringify(objErr);
    }

    let _message = '';

    if (typeof error === 'object') {
        let { message = '', errmsg = '' } = error || {};
        _message = message || msg || errmsg;
    } else {
        _message = msg;
    }
    return _message;
};