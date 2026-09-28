import { Link, NavLink, useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { LayoutDashboard, LogIn, LogOut } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

export default function Navbar() {
  const { user, isAdmin, signOut } = useAuth()
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  return (
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 24 }}
      className="sticky top-0 z-40 border-b-2 border-pink/10 bg-white/85 backdrop-blur-md"
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2">
        <Link to="/" className="group flex items-center gap-2">
          <img
            src="/logo-crop.webp"
            alt="Kickerz Girls League 2026"
            className="h-11 w-auto object-contain transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110"
          />
          <span className="hidden font-display text-xl leading-none text-navy sm:block">
            Kickerz <span className="text-pink">Girls</span> League
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <NavItem to="/">Home</NavItem>
          {isAdmin && (
            <NavItem to="/admin">
              <LayoutDashboard className="size-4" /> <span className="hidden sm:inline">Admin</span>
            </NavItem>
          )}
          {user ? (
            <button
              onClick={handleSignOut}
              className="flex cursor-pointer items-center gap-2 rounded-2xl bg-navy px-4 py-2 text-sm font-bold text-white transition hover:bg-pink"
            >
              <LogOut className="size-4" /> <span className="hidden sm:inline">Log out</span>
            </button>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-2 rounded-2xl bg-pink px-4 py-2 text-sm font-bold text-white shadow-[0_3px_0_0_#b8004f] transition hover:-translate-y-0.5 hover:bg-pink-light"
            >
              <LogIn className="size-4" /> Login
            </Link>
          )}
        </div>
      </nav>
    </motion.header>
  )
}

function NavItem({ to, children }) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `flex items-center gap-1.5 rounded-2xl px-3 py-2 text-sm font-bold transition ${
          isActive ? 'bg-pink-soft text-pink' : 'text-navy/70 hover:text-pink'
        }`
      }
    >
      {children}
    </NavLink>
  )
}
