import Link from 'next/link'
import NavStyles from '../components/styles/NavStyles'
import User from './User'

const Nav = () => (
    <NavStyles>
        <User>
            {({data: { me }}) => {
                console.log(me)
                if (me) return <p>{me.name}</p>;
                return null;
            }}
        </User>
        <Link href="/items">
            <a>Shop</a>
        </Link>
        <Link href="/sell">
            <a>Sell</a>
        </Link>
        <Link href="/signup">
            <a>Signup</a>
        </Link>
        <Link href="/ordes">
            <a>Orders</a>
        </Link>
        <Link href="/me">
            <a>Account</a>
        </Link>
    </NavStyles>
);

export default Nav;
