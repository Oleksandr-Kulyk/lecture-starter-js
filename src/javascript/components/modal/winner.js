import createElement from '../../helpers/domHelper';
import showModal from './modal';

export default function showWinnerModal(fighter) {
    const bodyElement = createElement({ tagName: 'div', className: 'modal-body winner-modal___body' });
    const winnerName = createElement({ tagName: 'div', className: 'winner-modal___name' });
    const winnerImage = createElement({
        tagName: 'img',
        className: 'winner-modal___image',
        attributes: {
            src: fighter.source,
            alt: fighter.name,
            title: fighter.name
        }
    });

    winnerName.innerText = fighter.name;
    bodyElement.append(winnerImage, winnerName);

    showModal({
        title: 'Winner',
        bodyElement,
        onClose: () => window.location.reload()
    });
}
