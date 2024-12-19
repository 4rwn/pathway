import styles from './Dashboard.module.css';
import { CircularProgressBar } from "@tomickigrzegorz/react-circular-progress-bar";

function Dashboard(props){     
      
    return (
        <div className={styles.dashboard}>
            <div className={styles.progressBar}> 
                <CircularProgressBar                
                    font-family="Montserrat"
                    percent={64}
                    colorSlice="#007bff"
                    colorCircle="#e5efff"
                    fontColor="#007bff"
                    fontSize="1.5rem"
                    fontWeight={400}
                    size={300}
                    stroke={10}
                    strokeBottom={5}
                    speed={40}
                    cut={0}
                    rotation={-90}
                    fill="#e5efff"
                    unit="%"
                    textPosition="0.35em"
                    animationOff={false}
                    inverse={false}
                    round={true}
                    number={true}
                    linearGradient={["#007bff", "#00bfff"]}
                />
            </div>
            
            <div className={styles.resultsButtonDiv}>
                <button className={styles.resultsButton}>
                    RESULTS
                </button>
            </div>
        </div>
    );
}

export default Dashboard