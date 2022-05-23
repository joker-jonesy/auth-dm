const Sequelize = require('sequelize');
const { STRING } = Sequelize;

const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/kermit_db');

const User = conn.define('user', {
    username: STRING,
    password: STRING
});

User.prototype.generateToken = function(){
    return {token: this.id}
}

User.byToken = async(token)=> {
    try {
        const user = await User.findByPk(token);
        if(user){
            return user;
        }
        const error = Error('bad credentials');
        error.status = 401;
        throw error;
    }
    catch(ex){
        const error = Error('bad credentials');
        error.status = 401;
        throw error;
    }
};

User.authenticate = async({ username, password })=> {
    const user = await User.findOne({
        where: {
            username,
            password
        }
    });
    if(user){
        return user.id;
    }
    const error = Error('bad credentials');
    error.status = 401;
    throw error;
};

const syncAndSeed = async()=> {
    await conn.sync({ force: true });
    const credentials = [
        { username: 'fozzie', password: 'wakka_wakka'},
        { username: 'gonzo', password: 'camila'},
        { username: 'beaker', password: 'memememe'}
    ];
    const [fozzie, gonzo, beaker] = await Promise.all(
        credentials.map( credential => User.create(credential))
    );
    return {
        users: {
            fozzie,
            gonzo,
            beaker
        }
    };
};

module.exports = {
    syncAndSeed,
    models: {
        User
    }
};
