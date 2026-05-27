import { afterEach, describe, expect, it, vi } from 'vitest';
import { getBlockPower, getDamage, getHitPower } from './fight';

describe('fight damage calculations', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('calculates hit power using attack and random multiplier', () => {
        vi.spyOn(Math, 'random').mockReturnValue(0.5);

        expect(getHitPower({ attack: 4 })).toBe(6);
    });

    it('calculates block power using defense and random multiplier', () => {
        vi.spyOn(Math, 'random').mockReturnValue(0.5);

        expect(getBlockPower({ defense: 4 })).toBe(6);
    });

    it('returns hit power minus block power as damage', () => {
        vi.spyOn(Math, 'random').mockReturnValueOnce(0.5).mockReturnValueOnce(0);

        const attacker = { attack: 4 };
        const defender = { defense: 3 };

        expect(getDamage(attacker, defender)).toBe(3);
    });

    it('does not return negative damage', () => {
        vi.spyOn(Math, 'random').mockReturnValueOnce(0).mockReturnValueOnce(0.5);

        const attacker = { attack: 1 };
        const defender = { defense: 5 };

        expect(getDamage(attacker, defender)).toBe(0);
    });
});
