/**
 * UI Components Index
 * ====================
 * Central export for all design system components
 */

// Core Components
export { Button, type ButtonProps } from './Button';
export { Checkbox, Radio, RadioGroup, Switch, Textarea } from './FormElements';
export type { CheckboxProps, RadioGroupProps, RadioProps, SwitchProps, TextareaProps } from './FormElements';
export { Input, type InputProps } from './Input';
export { Select, type SelectOption, type SelectProps } from './Select';

// Display Components
export { Avatar, AvatarGroup, type AvatarGroupProps, type AvatarProps } from './Avatar';
export { Badge, type BadgeProps } from './Badge';
export { Card, CardBody, CardFooter, CardHeader } from './Card';
export type { CardBodyProps, CardFooterProps, CardHeaderProps, CardProps } from './Card';

// Feedback Components
export { Alert, ToastProvider, useToast } from './Alert';
export type { AlertProps, ToastData } from './Alert';
export {
  LoadingOverlay, Skeleton, SkeletonAvatar,
  SkeletonButton,
  SkeletonCard,
  SkeletonTable, SkeletonText, Spinner
} from './Skeleton';
export type {
  LoadingOverlayProps, SkeletonAvatarProps,
  SkeletonButtonProps,
  SkeletonCardProps, SkeletonProps, SkeletonTableProps, SkeletonTextProps, SpinnerProps
} from './Skeleton';

// Overlay Components
export { CookiesConsent, type CookiesConsentProps } from './CookiesConsent';
export { ConfirmDialog, Modal, ModalBody, ModalFooter, ModalHeader } from './Modal';
export type { ConfirmDialogProps, ModalBodyProps, ModalFooterProps, ModalHeaderProps, ModalProps } from './Modal';

// Navigation Components
export { Footer, type FooterLink, type FooterProps, type FooterSection } from './Footer';
export { Tab, TabList, TabPanel, Tabs } from './Tabs';
export type { TabListProps, TabPanelProps, TabProps, TabsProps } from './Tabs';

// Accessibility Components
export {
  ContrastBadge, FocusTrap,
  Heading, LiveRegion, SkipLink, useFocusVisible, useReducedMotion, VisuallyHidden
} from './Accessibility';
export type {
  ContrastBadgeProps, FocusTrapProps,
  HeadingProps, LiveRegionProps, SkipLinkProps,
  VisuallyHiddenProps
} from './Accessibility';

// Brand & Icons
export {
  IconAlertCircle,
  IconAlertTriangle, IconArrowLeft, IconArrowRight, IconBell, IconCalendar, IconCheck,
  IconCheckCircle, IconChevronDown, IconChevronLeft,
  IconChevronRight, IconChevronUp, IconClock, IconClose, IconCopy, IconCreditCard, IconDownload, IconEdit, IconExternalLink, IconEye,
  IconEyeOff, IconFile, IconFilter, IconFolder, IconGithub, IconGrid, IconHeart, IconHome, IconImage, IconInfo, IconLinkedin, IconList, IconLock, IconLogout, IconMail, IconMenu, IconMessageCircle, IconMinus, IconPlus, IconRefresh, IconSearch, IconSend, IconSettings, IconShare, IconShoppingCart, IconStar, IconTrash, IconTwitter, IconUnlock, IconUpload, IconUser,
  IconUsers, Logo
} from './Icons';
export type { IconProps, LogoProps } from './Icons';

// Layout Components
export {
  AspectRatio, Container, Divider, Grid, MainLayout, Responsive, Section, Stack
} from './Layout';
export type {
  AspectRatioProps, ContainerProps, DividerProps, GridProps, MainLayoutProps, ResponsiveProps, SectionProps, StackProps
} from './Layout';

// Design System
export * from '@/lib/design-system/tokens';
export { announceToScreenReader, cn, debounce, getContrastRatio, lockBodyScroll, throttle, trapFocus } from '@/lib/design-system/utils';


