/**
 * UI Components Index
 * ====================
 * Central export for all design system components
 */

// Core Components
export { Button, type ButtonProps } from './Button';
export { Input, type InputProps } from './Input';
export { Textarea, Checkbox, Radio, RadioGroup, Switch } from './FormElements';
export type { TextareaProps, CheckboxProps, RadioProps, RadioGroupProps, SwitchProps } from './FormElements';
export { Select, type SelectProps, type SelectOption } from './Select';

// Display Components
export { Badge, type BadgeProps } from './Badge';
export { Avatar, AvatarGroup, type AvatarProps, type AvatarGroupProps } from './Avatar';
export { Card, CardHeader, CardBody, CardFooter } from './Card';
export type { CardProps, CardHeaderProps, CardBodyProps, CardFooterProps } from './Card';

// Feedback Components
export { Alert, ToastProvider, useToast } from './Alert';
export type { AlertProps, ToastData } from './Alert';
export { 
  Skeleton, 
  SkeletonText, 
  SkeletonAvatar, 
  SkeletonButton, 
  SkeletonCard, 
  SkeletonTable,
  Spinner,
  LoadingOverlay 
} from './Skeleton';
export type { 
  SkeletonProps, 
  SkeletonTextProps, 
  SkeletonAvatarProps, 
  SkeletonButtonProps, 
  SkeletonCardProps, 
  SkeletonTableProps,
  SpinnerProps,
  LoadingOverlayProps 
} from './Skeleton';

// Overlay Components
export { Modal, ModalHeader, ModalBody, ModalFooter, ConfirmDialog } from './Modal';
export type { ModalProps, ModalHeaderProps, ModalBodyProps, ModalFooterProps, ConfirmDialogProps } from './Modal';

// Navigation Components
export { Tabs, TabList, Tab, TabPanel } from './Tabs';
export type { TabsProps, TabListProps, TabProps, TabPanelProps } from './Tabs';
export { Navbar, type NavbarProps, type NavItem } from './Navbar';
export { Footer, type FooterProps, type FooterSection, type FooterLink } from './Footer';

// Accessibility Components
export {
  SkipLink,
  VisuallyHidden,
  LiveRegion,
  FocusTrap,
  Heading,
  ContrastBadge,
  useReducedMotion,
  useFocusVisible,
} from './Accessibility';
export type {
  SkipLinkProps,
  VisuallyHiddenProps,
  LiveRegionProps,
  FocusTrapProps,
  HeadingProps,
  ContrastBadgeProps,
} from './Accessibility';

// Brand & Icons
export {
  Logo,
  IconHome,
  IconSearch,
  IconBell,
  IconMenu,
  IconClose,
  IconUser,
  IconUsers,
  IconSettings,
  IconPlus,
  IconMinus,
  IconEdit,
  IconTrash,
  IconDownload,
  IconUpload,
  IconCheck,
  IconCheckCircle,
  IconAlertCircle,
  IconAlertTriangle,
  IconInfo,
  IconShoppingCart,
  IconHeart,
  IconStar,
  IconCreditCard,
  IconMail,
  IconMessageCircle,
  IconSend,
  IconChevronDown,
  IconChevronUp,
  IconChevronLeft,
  IconChevronRight,
  IconArrowRight,
  IconArrowLeft,
  IconExternalLink,
  IconCalendar,
  IconClock,
  IconFilter,
  IconGrid,
  IconList,
  IconImage,
  IconFile,
  IconFolder,
  IconEye,
  IconEyeOff,
  IconLock,
  IconUnlock,
  IconShare,
  IconCopy,
  IconRefresh,
  IconLogout,
  IconGithub,
  IconTwitter,
  IconLinkedin,
} from './Icons';
export type { LogoProps, IconProps } from './Icons';

// Layout Components
export {
  Container,
  Grid,
  Stack,
  Section,
  AspectRatio,
  Divider,
  Responsive,
  MainLayout,
} from './Layout';
export type {
  ContainerProps,
  GridProps,
  StackProps,
  SectionProps,
  AspectRatioProps,
  DividerProps,
  ResponsiveProps,
  MainLayoutProps,
} from './Layout';

// Design System
export * from '@/lib/design-system/tokens';
export { cn, trapFocus, announceToScreenReader, getContrastRatio, lockBodyScroll, debounce, throttle } from '@/lib/design-system/utils';


