import controls from '../../constants/controls';

const MIN_DAMAGE_MULTIPLIER = 1;
const MAX_DAMAGE_MULTIPLIER = 2;

export function getHitPower(fighter) {
    const criticalHitChance = Math.random() * (MAX_DAMAGE_MULTIPLIER - MIN_DAMAGE_MULTIPLIER) + MIN_DAMAGE_MULTIPLIER;

    return fighter.attack * criticalHitChance;
}

export function getBlockPower(fighter) {
    const dodgeChance = Math.random() * (MAX_DAMAGE_MULTIPLIER - MIN_DAMAGE_MULTIPLIER) + MIN_DAMAGE_MULTIPLIER;

    return fighter.defense * dodgeChance;
}

export function getDamage(attacker, defender) {
    const damage = getHitPower(attacker) - getBlockPower(defender);

    return Math.max(damage, 0);
}

export async function fight(firstFighter, secondFighter) {
    return new Promise(resolve => {
        let firstFighterHealth = firstFighter.health;
        let secondFighterHealth = secondFighter.health;
        let onKeyDown;

        const finishFight = winner => {
            document.removeEventListener('keydown', onKeyDown);
            resolve(winner);
        };

        const checkFightOver = () => {
            if (firstFighterHealth <= 0) {
                finishFight(secondFighter);
                return;
            }

            if (secondFighterHealth <= 0) {
                finishFight(firstFighter);
            }
        };

        const attackWithFirstFighter = () => {
            secondFighterHealth -= getDamage(firstFighter, secondFighter);
            checkFightOver();
        };

        const attackWithSecondFighter = () => {
            firstFighterHealth -= getDamage(secondFighter, firstFighter);
            checkFightOver();
        };

        onKeyDown = event => {
            switch (event.code) {
                case controls.PlayerOneAttack:
                    attackWithFirstFighter();
                    break;
                case controls.PlayerTwoAttack:
                    attackWithSecondFighter();
                    break;
                default:
                    break;
            }
        };

        document.addEventListener('keydown', onKeyDown);
    });
}
