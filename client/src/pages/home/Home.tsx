import ListInfoCard from '../../components/ListInfoCard';
import { listInfoCardsData } from './listInfoCardsData';
import '../../styles/home.css';

function Home() {
  return (
    <div className='home'>
      <h2>Списки:</h2>
      <div className={'cards-list'}>
        {
          listInfoCardsData.map(({ description, emoji, link, title }, index) => (
            <ListInfoCard
              description={description}
              emoji={emoji}
              key={index}
              link={link}
              title={title} />
          ))
        }
      </div>
    </div>
  );
}

export default Home;
