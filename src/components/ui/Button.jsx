import { motion } from 'motion/react'

const VARIANTS = {
  primary: 'bg-pink text-white shadow-[0_4px_0_0_#b8004f] hover:bg-pink-light',
  dark: 'bg-navy text-white shadow-[0_4px_0_0_#000] hover:bg-navy-light',
  sun: 'bg-sun text-navy shadow-[0_4px_0_0_#c99a00] hover:brightness-105',
  ghost: 'bg-white text-navy border-2 border-navy/10 hover:border-pink hover:text-pink',
  danger: 'bg-white text-red-600 border-2 border-red-200 hover:bg-red-50',
}

const SIZES = {
  sm: 'px-3 py-1.5 text-sm rounded-xl',
  md: 'px-5 py-2.5 rounded-2xl',
  lg: 'px-7 py-3.5 text-lg rounded-2xl',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  icon: Icon,
  children,
  disabled,
  ...props
}) {
  return (
    <motion.button
      whileHover={disabled ? undefined : { y: -2 }}
      whileTap={disabled ? undefined : { y: 2, scale: 0.98 }}
      disabled={disabled}
      className={`inline-flex cursor-pointer items-center justify-center gap-2 font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {Icon && <Icon className="size-4 shrink-0" strokeWidth={2.5} />}
      {children}
    </motion.button>
  )
}
