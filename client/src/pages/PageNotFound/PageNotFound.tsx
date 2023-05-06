import Emoji from "../../enums/Emoji.enum"
import '../../styles/pageNotFound.css'

function PageNotFound() {
    return (
        <div className='page-not-found'>
            <h1>
                {`Page not found ${Emoji.bus}`}
            </h1>
        </div>
    )
}

export default PageNotFound