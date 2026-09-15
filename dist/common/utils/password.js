import bcrypt from 'bcryptjs';
let cachedRounds = null;
function getRounds(configService) {
    if (cachedRounds !== null) {
        return cachedRounds;
    }
    if (configService) {
        cachedRounds = configService.get('bcryptRounds') ?? 12;
        return cachedRounds;
    }
    return 12;
}
export async function hashPassword(password, configService) {
    return bcrypt.hash(password, getRounds(configService));
}
export async function verifyPassword(password, hash) {
    return bcrypt.compare(password, hash);
}
//# sourceMappingURL=password.js.map