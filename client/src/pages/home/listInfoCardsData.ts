import Emoji from "../../enums/Emoji.enum";

export const listInfoCardsData = [
    {
        title: 'Автобуси',
        description: 'Містить інформацію про автобуси',
        emoji: Emoji.bus,
        link: '/buses',
    },
    {
        title: 'Компанії перевізники',
        description: 'Містить інформацію про компанії перевізники',
        emoji: Emoji.company,
        link: '/carrier_companies',
    },
    {
        title: 'Водії',
        description: 'Містить інформацію про водіїв',
        emoji: Emoji.human,
        link: '/drivers',
    },
    {
        title: 'Покупці',
        description: 'Містить інформацію про покупців',
        emoji: Emoji.money,
        link: '/buyers',
    },
    {
        title: 'Рейси',
        description: 'Містить інформацію про рейси',
        emoji: Emoji.road,
        link: '/flights',
    },
]