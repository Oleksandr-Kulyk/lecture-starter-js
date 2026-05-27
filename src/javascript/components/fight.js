import controls from '../../constants/controls';

const MIN_DAMAGE_MULTIPLIER = 1;
const MAX_DAMAGE_MULTIPLIER = 2;
const CRITICAL_HIT_COOLDOWN = 10000;

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
        const firstFighterState = {
            health: firstFighter.health,
            maxHealth: firstFighter.health,
            indicator: document.getElementById('left-fighter-indicator'),
            isBlockActive: false,
            isCriticalHitAvailable: true,
            criticalHitTimeoutId: null
        };
        const secondFighterState = {
            health: secondFighter.health,
            maxHealth: secondFighter.health,
            indicator: document.getElementById('right-fighter-indicator'),
            isBlockActive: false,
            isCriticalHitAvailable: true,
            criticalHitTimeoutId: null
        };
        const pressedKeys = new Set();
        let onKeyDown;
        let onKeyUp;

        const finishFight = winner => {
            document.removeEventListener('keydown', onKeyDown);
            document.removeEventListener('keyup', onKeyUp);
            clearTimeout(firstFighterState.criticalHitTimeoutId);
            clearTimeout(secondFighterState.criticalHitTimeoutId);
            resolve(winner);
        };

        const updateHealthIndicator = fighterState => {
            const { indicator, health, maxHealth } = fighterState;
            const healthPercentage = (Math.max(health, 0) / maxHealth) * 100;

            indicator.style.width = `${healthPercentage}%`;
        };

        const checkFightOver = () => {
            if (firstFighterState.health <= 0) {
                finishFight(secondFighter);
                return;
            }

            if (secondFighterState.health <= 0) {
                finishFight(firstFighter);
            }
        };

        const applyDamage = (fighterState, damage) => {
            return fighterState.health - damage;
        };

        const isCombinationPressed = combination => {
            return combination.every(key => pressedKeys.has(key));
        };

        const activateFirstFighterBlock = () => {
            firstFighterState.isBlockActive = true;
        };

        const deactivateFirstFighterBlock = () => {
            firstFighterState.isBlockActive = false;
        };

        const activateSecondFighterBlock = () => {
            secondFighterState.isBlockActive = true;
        };

        const deactivateSecondFighterBlock = () => {
            secondFighterState.isBlockActive = false;
        };

        const attackWithFirstFighter = () => {
            if (firstFighterState.isBlockActive || secondFighterState.isBlockActive) {
                return;
            }

            const damage = getDamage(firstFighter, secondFighter);

            secondFighterState.health = applyDamage(secondFighterState, damage);
            updateHealthIndicator(secondFighterState);
            checkFightOver();
        };

        const attackWithSecondFighter = () => {
            if (secondFighterState.isBlockActive || firstFighterState.isBlockActive) {
                return;
            }

            const damage = getDamage(secondFighter, firstFighter);

            firstFighterState.health = applyDamage(firstFighterState, damage);
            updateHealthIndicator(firstFighterState);
            checkFightOver();
        };

        const performFirstFighterCriticalHit = () => {
            if (!firstFighterState.isCriticalHitAvailable || firstFighterState.isBlockActive) {
                return;
            }

            firstFighterState.isCriticalHitAvailable = false;
            secondFighterState.health = applyDamage(secondFighterState, firstFighter.attack * 2);
            updateHealthIndicator(secondFighterState);
            checkFightOver();

            firstFighterState.criticalHitTimeoutId = setTimeout(() => {
                firstFighterState.isCriticalHitAvailable = true;
            }, CRITICAL_HIT_COOLDOWN);
        };

        const performSecondFighterCriticalHit = () => {
            if (!secondFighterState.isCriticalHitAvailable || secondFighterState.isBlockActive) {
                return;
            }

            secondFighterState.isCriticalHitAvailable = false;
            firstFighterState.health = applyDamage(firstFighterState, secondFighter.attack * 2);
            updateHealthIndicator(firstFighterState);
            checkFightOver();

            secondFighterState.criticalHitTimeoutId = setTimeout(() => {
                secondFighterState.isCriticalHitAvailable = true;
            }, CRITICAL_HIT_COOLDOWN);
        };

        onKeyDown = event => {
            pressedKeys.add(event.code);

            if (event.repeat) {
                return;
            }

            if (isCombinationPressed(controls.PlayerOneCriticalHitCombination)) {
                performFirstFighterCriticalHit();
            }

            if (isCombinationPressed(controls.PlayerTwoCriticalHitCombination)) {
                performSecondFighterCriticalHit();
            }

            switch (event.code) {
                case controls.PlayerOneAttack:
                    attackWithFirstFighter();
                    break;
                case controls.PlayerTwoAttack:
                    attackWithSecondFighter();
                    break;
                case controls.PlayerOneBlock:
                    activateFirstFighterBlock();
                    break;
                case controls.PlayerTwoBlock:
                    activateSecondFighterBlock();
                    break;
                default:
                    break;
            }
        };

        onKeyUp = event => {
            pressedKeys.delete(event.code);

            switch (event.code) {
                case controls.PlayerOneBlock:
                    deactivateFirstFighterBlock();
                    break;
                case controls.PlayerTwoBlock:
                    deactivateSecondFighterBlock();
                    break;
                default:
                    break;
            }
        };

        document.addEventListener('keydown', onKeyDown);
        document.addEventListener('keyup', onKeyUp);
    });
}
