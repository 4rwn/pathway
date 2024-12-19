import styles from './Header.module.css'
import accIcon from './header_icons/account_icon.png';

function Header(props){

    return (
        <header className={styles.headerLine}>
            <h1 className={styles.logo}>Pathway Navigator</h1>
            <div className={styles.account}>
                <img className={styles.accIcon} src={ accIcon }/>
                <h2 className={styles.accText}>Konto</h2>
            </div>
        </header>)
}

export default Header