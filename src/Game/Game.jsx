import styles from './Game.module.css';

function Title(){
    return(
        <div className={styles.titleDiv}>
            
            <h1 className={styles.title}>Tests</h1>
        </div>
    );
}

function Game(props){

    return (
        <div className={styles.gameCard}>
            <img className={styles.gamePic} src={ props.image }/>
            <h2 className={styles.gameName}>{props.gameName}</h2>
            <p className={styles.gameDescription}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores, ipsa temporibus officia nostrum ea deserunt? Aliquid saepe dolores aut ipsum placeat odit corporis nobis, magni, maiores ad reprehenderit provident vitae.</p>
            <h3 className={styles.estTime}>~ {props.estTime}min</h3>
        </div>
    );
}

export {Title, Game};
