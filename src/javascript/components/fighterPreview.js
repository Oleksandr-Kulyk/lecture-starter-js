import createElement from '../helpers/domHelper';

const FIGHTER_STATS = ['health', 'attack', 'defense'];

export function createFighterImage(fighter) {
    const { source, name } = fighter;
    const attributes = {
        src: source,
        title: name,
        alt: name
    };
    const imgElement = createElement({
        tagName: 'img',
        className: 'fighter-preview___img',
        attributes
    });

    return imgElement;
}

function createFighterName(name) {
    const nameElement = createElement({ tagName: 'h3', className: 'fighter-preview___name' });
    nameElement.textContent = name;

    return nameElement;
}

function createFighterStat(statName, statValue) {
    const statElement = createElement({ tagName: 'li', className: 'fighter-preview___stat' });
    statElement.textContent = `${statName}: ${statValue}`;

    return statElement;
}

function createFighterStats(fighter) {
    const statsElement = createElement({ tagName: 'ul', className: 'fighter-preview___stats' });
    const statElements = FIGHTER_STATS.map(stat => createFighterStat(stat, fighter[stat]));

    statsElement.append(...statElements);

    return statsElement;
}

export function createFighterPreview(fighter, position) {
    const positionClassName = position === 'right' ? 'fighter-preview___right' : 'fighter-preview___left';
    const fighterElement = createElement({
        tagName: 'div',
        className: `fighter-preview___root ${positionClassName}`
    });

    if (fighter) {
        fighterElement.append(
            createFighterImage(fighter),
            createFighterName(fighter.name),
            createFighterStats(fighter)
        );
    }

    return fighterElement;
}
