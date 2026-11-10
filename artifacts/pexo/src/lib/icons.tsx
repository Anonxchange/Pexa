import { forwardRef, type SVGProps } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  AccessibilityIcon as _Accessibility,
  ActivityIcon as _Activity,
  AlertCircleIcon as _AlertCircle,
  Alert01Icon as _Alert01,
  AlignLeftIcon as _AlignLeft,
  ArrowDown01Icon as _ArrowDown,
  ArrowDownLeft01Icon as _ArrowDownLeft,
  ArrowDownToLineIcon as _ArrowDownToLine,
  ArrowUpDownIcon as _ArrowUpDown,
  ArrowLeft01Icon as _ArrowLeft,
  ArrowRight01Icon as _ArrowRight,
  ArrowLeftRightIcon as _ArrowLeftRight,
  ArrowUp01Icon as _ArrowUp,
  ArrowUpFromLineIcon as _ArrowUpFromLine,
  ArrowUpRight01Icon as _ArrowUpRight,
  Award01Icon as _Award,
  BadgeCheckIcon as _BadgeCheck,
  BanIcon as _Ban,
  BarChartIcon as _BarChart,
  BellIcon as _Bell,
  BellOffIcon as _BellOff,
  BellRingIcon as _BellRing,
  Bitcoin01Icon as _Bitcoin,
  BitcoinSmartphone01Icon as _BitcoinSmartphone,
  BlocksIcon as _Blocks,
  BoltIcon as _Bolt,
  BookOpen01Icon as _BookOpen,
  Bookmark01Icon as _Bookmark,
  BotIcon as _Bot,
  BoxIcon as _Box,
  Building02Icon as _Building2,
  Calendar01Icon as _Calendar,
  Camera01Icon as _Camera,
  Chart01Icon as _Chart,
  ChartCandlestickIcon as _ChartCandlestick,
  ChartHighLowIcon as _ChartHighLow,
  ChartLineData01Icon as _ChartLineData,
  CheckIcon as _Check,
  CheckCheckIcon as _CheckCheck,
  CheckmarkCircle01Icon as _CheckmarkCircle,
  CheckmarkSquare01Icon as _CheckmarkSquare,
  ChevronDownIcon as _ChevronDown,
  ChevronLeftIcon as _ChevronLeft,
  ChevronRightIcon as _ChevronRight,
  ChevronUpIcon as _ChevronUp,
  CircleIcon as _Circle,
  ClipboardCheckIcon as _ClipboardCheck,
  Clock01Icon as _Clock,
  CodeIcon as _Code,
  CogIcon as _Cog,
  Coffee01Icon as _Coffee,
  Coins01Icon as _Coins,
  CookieIcon as _Cookie,
  Copy01Icon as _Copy,
  CpuIcon as _Cpu,
  CreditCardIcon as _CreditCard,
  CreditCardChangeIcon as _CreditCardChange,
  Crown02Icon as _Crown,
  Database01Icon as _Database,
  Dollar01Icon as _Dollar,
  DotIcon as _Dot,
  Download01Icon as _Download,
  DropletsIcon as _Droplets,
  Dumbbell01Icon as _Dumbbell,
  Edit01Icon as _Edit,
  ExternalLinkIcon as _ExternalLink,
  EyeIcon as _Eye,
  EyeOffIcon as _EyeOff,
  Facebook01Icon as _Facebook,
  File01Icon as _File,
  FileCheckCornerIcon as _FileCheck,
  FileEditIcon as _FileText,
  FilterIcon as _Filter,
  FingerPrintAddIcon as _Fingerprint,
  Flag01Icon as _Flag,
  FlameIcon as _Flame,
  GamepadIcon as _Gamepad,
  GemIcon as _Gem,
  GiftIcon as _Gift,
  GitBranchMinusIcon as _GitBranch,
  Github01Icon as _Github,
  GlobeIcon as _Globe,
  GraduationCapIcon as _GraduationCap,
  GripVerticalIcon as _GripVertical,
  HardDriveIcon as _HardDrive,
  HeadphonesIcon as _Headphones,
  HeartIcon as _Heart,
  HeartHandshakeIcon as _HeartHandshake,
  HelpCircleIcon as _HelpCircle,
  HistoryIcon as _History,
  Home01Icon as _Home,
  Image01Icon as _Image,
  InformationCircleIcon as _Information,
  InstagramIcon as _Instagram,
  Key01Icon as _Key,
  Key02Icon as _KeyRound,
  LandmarkIcon as _Landmark,
  LaptopIcon as _Laptop,
  Layers01Icon as _Layers,
  LayoutGridIcon as _LayoutGrid,
  ListViewIcon as _ListView,
  Idea01Icon as _Lightbulb,
  Link02Icon as _Link2,
  LinkedinIcon as _Linkedin,
  ListFilterPlusIcon as _ListFilter,
  LoaderPinwheelIcon as _LoaderPinwheel,
  Loading01Icon as _Loading,
  LockedIcon as _Locked,
  Login01Icon as _LogIn,
  Logout01Icon as _LogOut,
  Mail01Icon as _Mail,
  MapPinCheckIcon as _MapPin,
  Maximize01Icon as _Maximize,
  Medal01Icon as _Medal,
  Megaphone01Icon as _Megaphone,
  Menu01Icon as _Menu,
  Message01Icon as _Message01,
  Message02Icon as _Message02,
  MinimizeIcon as _Minimize,
  MinusSignIcon as _MinusSign,
  MonitorDotIcon as _MonitorDot,
  Moon01Icon as _Moon,
  MoreHorizontalIcon as _MoreHorizontal,
  MoreVerticalIcon as _MoreVertical,
  MuteIcon as _Mute,
  MusicNote01Icon as _MusicNote,
  Package01Icon as _Package,
  PackageSearch01Icon as _PackageSearch,
  PanelLeftCloseIcon as _PanelLeftClose,
  Attachment01Icon as _Attachment,
  SparklesIcon as _Sparkles,
  PencilEdit01Icon as _PencilEdit,
  PhoneArrowDownIcon as _Phone,
  PercentIcon as _Percent,
  Add01Icon as _Add,
  AddCircleIcon as _AddCircle,
  PlayCircleIcon as _PlayCircle,
  QrCodeIcon as _QrCode,
  ReceiptDollarIcon as _ReceiptDollar,
  ReceiptTextIcon as _ReceiptText,
  Refresh01Icon as _Refresh,
  RepeatOne01Icon as _RepeatOne,
  Rotate01Icon as _Rotate,
  BalanceScaleIcon as _BalanceScale,
  Search01Icon as _Search,
  SendIcon as _SendIcon,
  Settings01Icon as _Settings,
  Share01Icon as _Share,
  Shield01Icon as _Shield,
  ShieldQuestionMarkIcon as _ShieldQuestion,
  ShoppingBag01Icon as _ShoppingBag,
  ShoppingCart01Icon as _ShoppingCart,
  SlidersHorizontalIcon as _SlidersHorizontal,
  ShuffleIcon as _Shuffle,
  SlidersVerticalIcon as _SlidersVertical,
  SmartPhone01Icon as _SmartPhone,
  SnowIcon as _Snow,
  Square01Icon as _Square,
  StarIcon as _Star,
  Store01Icon as _Store,
  SunIcon as _Sun,
  Tablet01Icon as _Tablet,
  Tag01Icon as _Tag,
  Target01Icon as _Target,
  TerminalIcon as _Terminal,
  ThumbsDownEllipseIcon as _ThumbsDownEllipse,
  ThumbsUpEllipseIcon as _ThumbsUpEllipse,
  Ticket01Icon as _Ticket,
  Timer01Icon as _Timer,
  DeleteIcon as _Delete,
  TrendingUpDownIcon as _TrendingUpDown,
  TruckIcon as _Truck,
  TwitterSquareIcon as _Twitter,
  LockerIcon as _Locker,
  Upload01Icon as _Upload,
  User02Icon as _User,
  UserCheck01Icon as _UserCheck,
  UserAdd01Icon as _UserAdd,
  UserGroupIcon as _UserGroup,
  ForkIcon as _Fork,
  Video01Icon as _Video,
  VolumeHighIcon as _VolumeHigh,
  Wallet01Icon as _Wallet,
  WalletAdd02Icon as _WalletAdd,
  Cancel01Icon as _Cancel,
  CancelCircleIcon as _CancelCircle,
  WebhookIcon as _Webhook,
  Wifi01Icon as _Wifi,
  ZapIcon as _Zap,
} from '@hugeicons/core-free-icons';

type IconProps = SVGProps<SVGSVGElement> & {
  size?: number | string;
  color?: string;
  strokeWidth?: number;
  absoluteStrokeWidth?: boolean;
};

function makeIcon(iconData: object, displayName: string) {
  const Comp = forwardRef<SVGSVGElement, IconProps>(
    ({ size = 24, color, strokeWidth = 1.5, absoluteStrokeWidth: _abs, className, style, ...rest }, ref) => {
      const {
        'aria-label': ariaLabel,
        'aria-labelledby': ariaLabelledBy,
        title,
        'aria-hidden': ariaHidden,
        focusable,
        ...svgProps
      } = rest;

      const hasAccessibleName = Boolean(ariaLabel || ariaLabelledBy || title);

      return (
        <HugeiconsIcon
          ref={ref as React.RefObject<SVGSVGElement>}
          icon={iconData}
          size={size}
          strokeWidth={strokeWidth}
          color={color}
          className={className}
          style={style}
          {...svgProps}
          aria-hidden={ariaHidden ?? (!hasAccessibleName ? true : undefined)}
          focusable={focusable ?? (!hasAccessibleName ? false : undefined)}
        />
      );
    }
  );
  Comp.displayName = displayName;
  return Comp;
}

export const Accessibility = makeIcon(_Accessibility, 'Accessibility');
export const Activity = makeIcon(_Activity, 'Activity');
export const AlertCircle = makeIcon(_AlertCircle, 'AlertCircle');
export const AlertTriangle = makeIcon(_Alert01, 'AlertTriangle');
export const AlignLeft = makeIcon(_AlignLeft, 'AlignLeft');
export const AreaChart = makeIcon(_Chart, 'AreaChart');
export const ArrowDown = makeIcon(_ArrowDown, 'ArrowDown');
export const ArrowDownLeft = makeIcon(_ArrowDownLeft, 'ArrowDownLeft');
export const ArrowDownToLine = makeIcon(_ArrowDownToLine, 'ArrowDownToLine');
export const ArrowDownUp = makeIcon(_ArrowUpDown, 'ArrowDownUp');
export const ArrowLeft = makeIcon(_ArrowLeft, 'ArrowLeft');
export const ArrowLeftRight = makeIcon(_ArrowLeftRight, 'ArrowLeftRight');
export const ArrowRight = makeIcon(_ArrowRight, 'ArrowRight');
export const ArrowRightLeft = makeIcon(_ArrowLeftRight, 'ArrowRightLeft');
export const ArrowUp = makeIcon(_ArrowUp, 'ArrowUp');
export const ArrowUpDown = makeIcon(_ArrowUpDown, 'ArrowUpDown');
export const ArrowUpFromLine = makeIcon(_ArrowUpFromLine, 'ArrowUpFromLine');
export const ArrowUpRight = makeIcon(_ArrowUpRight, 'ArrowUpRight');
export const Award = makeIcon(_Award, 'Award');
export const BadgeCheck = makeIcon(_BadgeCheck, 'BadgeCheck');
export const Ban = makeIcon(_Ban, 'Ban');
export const BarChart2 = makeIcon(_BarChart, 'BarChart2');
export const BarChart3 = makeIcon(_BarChart, 'BarChart3');
export const Bell = makeIcon(_Bell, 'Bell');
export const BellOff = makeIcon(_BellOff, 'BellOff');
export const BellRing = makeIcon(_BellRing, 'BellRing');
export const Bitcoin = makeIcon(_Bitcoin, 'Bitcoin');
export const BitcoinSmartphone = makeIcon(_BitcoinSmartphone, 'BitcoinSmartphone');
export const Blocks = makeIcon(_Blocks, 'Blocks');
export const Bolt = makeIcon(_Bolt, 'Bolt');
export const BookOpen = makeIcon(_BookOpen, 'BookOpen');
export const Bookmark = makeIcon(_Bookmark, 'Bookmark');
export const Bot = makeIcon(_Bot, 'Bot');
export const Box = makeIcon(_Box, 'Box');
export const Building2 = makeIcon(_Building2, 'Building2');
export const Calendar = makeIcon(_Calendar, 'Calendar');
export const Camera = makeIcon(_Camera, 'Camera');
export const CandlestickChart = makeIcon(_Chart, 'CandlestickChart');
export const ChartCandlestick = makeIcon(_ChartCandlestick, 'ChartCandlestick');
export const ChartHighLow = makeIcon(_ChartHighLow, 'ChartHighLow');
export const ChartLineData = makeIcon(_ChartLineData, 'ChartLineData');
export const Check = makeIcon(_Check, 'Check');
export const CheckCheck = makeIcon(_CheckCheck, 'CheckCheck');
export const CheckCircle = makeIcon(_CheckmarkCircle, 'CheckCircle');
export const CheckCircle2 = makeIcon(_CheckmarkCircle, 'CheckCircle2');
export const CheckSquare = makeIcon(_CheckmarkSquare, 'CheckSquare');
export const ChevronDown = makeIcon(_ChevronDown, 'ChevronDown');
export const ChevronLeft = makeIcon(_ChevronLeft, 'ChevronLeft');
export const ChevronRight = makeIcon(_ChevronRight, 'ChevronRight');
export const ChevronsUpDown = makeIcon(_ChevronDown, 'ChevronsUpDown');
export const ChevronUp = makeIcon(_ChevronUp, 'ChevronUp');
export const Circle = makeIcon(_Circle, 'Circle');
export const ClipboardList = makeIcon(_ClipboardCheck, 'ClipboardList');
export const Clock = makeIcon(_Clock, 'Clock');
export const Code = makeIcon(_Code, 'Code');
export const Code2 = makeIcon(_Code, 'Code2');
export const Coffee = makeIcon(_Coffee, 'Coffee');
export const Cog = makeIcon(_Cog, 'Cog');
export const Coins = makeIcon(_Coins, 'Coins');
export const Cookie = makeIcon(_Cookie, 'Cookie');
export const Copy = makeIcon(_Copy, 'Copy');
export const Cpu = makeIcon(_Cpu, 'Cpu');
export const CreditCard = makeIcon(_CreditCard, 'CreditCard');
export const CreditCardChange = makeIcon(_CreditCardChange, 'CreditCardChange');
export const Crown = makeIcon(_Crown, 'Crown');
export const Database = makeIcon(_Database, 'Database');
export const DollarSign = makeIcon(_Dollar, 'DollarSign');
export const Dot = makeIcon(_Dot, 'Dot');
export const Download = makeIcon(_Download, 'Download');
export const Droplets = makeIcon(_Droplets, 'Droplets');
export const Dumbbell = makeIcon(_Dumbbell, 'Dumbbell');
export const Edit = makeIcon(_Edit, 'Edit');
export const ExternalLink = makeIcon(_ExternalLink, 'ExternalLink');
export const Eye = makeIcon(_Eye, 'Eye');
export const EyeOff = makeIcon(_EyeOff, 'EyeOff');
export const Facebook = makeIcon(_Facebook, 'Facebook');
export const File = makeIcon(_File, 'File');
export const FileCheck = makeIcon(_FileCheck, 'FileCheck');
export const FileText = makeIcon(_FileText, 'FileText');
export const Filter = makeIcon(_Filter, 'Filter');
export const Fingerprint = makeIcon(_Fingerprint, 'Fingerprint');
export const Flag = makeIcon(_Flag, 'Flag');
export const Flame = makeIcon(_Flame, 'Flame');
export const Gamepad2 = makeIcon(_Gamepad, 'Gamepad2');
export const Gem = makeIcon(_Gem, 'Gem');
export const Gift = makeIcon(_Gift, 'Gift');
export const GitBranch = makeIcon(_GitBranch, 'GitBranch');
export const Github = makeIcon(_Github, 'Github');
export const Globe = makeIcon(_Globe, 'Globe');
export const GraduationCap = makeIcon(_GraduationCap, 'GraduationCap');
export const GripVertical = makeIcon(_GripVertical, 'GripVertical');
export const HardDrive = makeIcon(_HardDrive, 'HardDrive');
export const Headphones = makeIcon(_Headphones, 'Headphones');
export const HeadphonesIcon = Headphones;
export const Heart = makeIcon(_Heart, 'Heart');
export const HeartHandshake = makeIcon(_HeartHandshake, 'HeartHandshake');
export const HelpCircle = makeIcon(_HelpCircle, 'HelpCircle');
export const History = makeIcon(_History, 'History');
export const Home = makeIcon(_Home, 'Home');
export const Image = makeIcon(_Image, 'Image');
export const Info = makeIcon(_Information, 'Info');
export const Instagram = makeIcon(_Instagram, 'Instagram');
export const Key = makeIcon(_Key, 'Key');
export const KeyRound = makeIcon(_KeyRound, 'KeyRound');
export const Landmark = makeIcon(_Landmark, 'Landmark');
export const Laptop = makeIcon(_Laptop, 'Laptop');
export const Layers = makeIcon(_Layers, 'Layers');
export const LayoutDashboard = makeIcon(_LayoutGrid, 'LayoutDashboard');
export const LayoutGrid = makeIcon(_LayoutGrid, 'LayoutGrid');
export const LayoutList = makeIcon(_ListView, 'LayoutList');
export const Lightbulb = makeIcon(_Lightbulb, 'Lightbulb');
export const Link2 = makeIcon(_Link2, 'Link2');
export const Linkedin = makeIcon(_Linkedin, 'Linkedin');
export const ListFilter = makeIcon(_ListFilter, 'ListFilter');
export const Loader = makeIcon(_LoaderPinwheel, 'Loader');
export const Loader2 = makeIcon(_Loading, 'Loader2');
export const Loader2Icon = Loader2;
export const Lock = makeIcon(_Locked, 'Lock');
export const LogIn = makeIcon(_LogIn, 'LogIn');
export const LogOut = makeIcon(_LogOut, 'LogOut');
export const Mail = makeIcon(_Mail, 'Mail');
export const MapPin = makeIcon(_MapPin, 'MapPin');
export const Maximize2 = makeIcon(_Maximize, 'Maximize2');
export const Medal = makeIcon(_Medal, 'Medal');
export const Megaphone = makeIcon(_Megaphone, 'Megaphone');
export const Menu = makeIcon(_Menu, 'Menu');
export const MessageCircle = makeIcon(_Message01, 'MessageCircle');
export const MessageSquare = makeIcon(_Message02, 'MessageSquare');
export const Minimize2 = makeIcon(_Minimize, 'Minimize2');
export const Minus = makeIcon(_MinusSign, 'Minus');
export const Monitor = makeIcon(_MonitorDot, 'Monitor');
export const Moon = makeIcon(_Moon, 'Moon');
export const MoreHorizontal = makeIcon(_MoreHorizontal, 'MoreHorizontal');
export const MoreVertical = makeIcon(_MoreVertical, 'MoreVertical');
export const Music = makeIcon(_MusicNote, 'Music');
export const Package = makeIcon(_Package, 'Package');
export const PackageSearch = makeIcon(_PackageSearch, 'PackageSearch');
export const PanelLeft = makeIcon(_PanelLeftClose, 'PanelLeft');
export const PanelLeftIcon = PanelLeft;
export const Paperclip = makeIcon(_Attachment, 'Paperclip');
export const PartyPopper = makeIcon(_Sparkles, 'PartyPopper');
export const PenLine = makeIcon(_PencilEdit, 'PenLine');
export const Pencil = makeIcon(_PencilEdit, 'Pencil');
export const Percent = makeIcon(_Percent, 'Percent');
export const Phone = makeIcon(_Phone, 'Phone');
export const PlayCircle = makeIcon(_PlayCircle, 'PlayCircle');
export const Plus = makeIcon(_Add, 'Plus');
export const PlusCircle = makeIcon(_AddCircle, 'PlusCircle');
export const QrCode = makeIcon(_QrCode, 'QrCode');
export const Receipt = makeIcon(_ReceiptDollar, 'Receipt');
export const ReceiptText = makeIcon(_ReceiptText, 'ReceiptText');
export const RefreshCw = makeIcon(_Refresh, 'RefreshCw');
export const Repeat2 = makeIcon(_RepeatOne, 'Repeat2');
export const RotateCcw = makeIcon(_Rotate, 'RotateCcw');
export const RotateCw = makeIcon(_Rotate, 'RotateCw');
export const Scale = makeIcon(_BalanceScale, 'Scale');
export const Search = makeIcon(_Search, 'Search');
export const Send = makeIcon(_SendIcon, 'Send');
export const Settings = makeIcon(_Settings, 'Settings');
export const Share2 = makeIcon(_Share, 'Share2');
export const Shield = makeIcon(_Shield, 'Shield');
export const ShieldAlert = makeIcon(_Shield, 'ShieldAlert');
export const ShieldCheck = makeIcon(_Shield, 'ShieldCheck');
export const ShieldOff = makeIcon(_Ban, 'ShieldOff');
export const ShieldQuestion = makeIcon(_ShieldQuestion, 'ShieldQuestion');
export const ShoppingBag = makeIcon(_ShoppingBag, 'ShoppingBag');
export const ShoppingCart = makeIcon(_ShoppingCart, 'ShoppingCart');
export const Shuffle = makeIcon(_Shuffle, 'Shuffle');
export const Sliders = makeIcon(_SlidersHorizontal, 'Sliders');
export const SlidersHorizontal = makeIcon(_SlidersHorizontal, 'SlidersHorizontal');
export const SlidersVertical = makeIcon(_SlidersVertical, 'SlidersVertical');
export const Smartphone = makeIcon(_SmartPhone, 'Smartphone');
export const Snowflake = makeIcon(_Snow, 'Snowflake');
export const Sparkles = makeIcon(_Sparkles, 'Sparkles');
export const Square = makeIcon(_Square, 'Square');
export const Star = makeIcon(_Star, 'Star');
export const Store = makeIcon(_Store, 'Store');
export const Sun = makeIcon(_Sun, 'Sun');
export const Tablet = makeIcon(_Tablet, 'Tablet');
export const Tag = makeIcon(_Tag, 'Tag');
export const Target = makeIcon(_Target, 'Target');
export const Terminal = makeIcon(_Terminal, 'Terminal');
export const ThumbsDown = makeIcon(_ThumbsDownEllipse, 'ThumbsDown');
export const ThumbsUp = makeIcon(_ThumbsUpEllipse, 'ThumbsUp');
export const Ticket = makeIcon(_Ticket, 'Ticket');
export const TicketCheck = makeIcon(_Ticket, 'TicketCheck');
export const TicketPercent = makeIcon(_Ticket, 'TicketPercent');
export const Timer = makeIcon(_Timer, 'Timer');
export const Trash2 = makeIcon(_Delete, 'Trash2');
export const TrendingDown = makeIcon(_TrendingUpDown, 'TrendingDown');
export const TrendingUp = makeIcon(_TrendingUpDown, 'TrendingUp');
export const Trophy = makeIcon(_Award, 'Trophy');
export const Truck = makeIcon(_Truck, 'Truck');
export const Twitter = makeIcon(_Twitter, 'Twitter');
export const Unlock = makeIcon(_Locker, 'Unlock');
export const Upload = makeIcon(_Upload, 'Upload');
export const User = makeIcon(_User, 'User');
export const UserCheck = makeIcon(_UserCheck, 'UserCheck');
export const UserPlus = makeIcon(_UserAdd, 'UserPlus');
export const Users = makeIcon(_UserGroup, 'Users');
export const UtensilsCrossed = makeIcon(_Fork, 'UtensilsCrossed');
export const Video = makeIcon(_Video, 'Video');
export const Volume2 = makeIcon(_VolumeHigh, 'Volume2');
export const VolumeX = makeIcon(_Mute, 'VolumeX');
export const Wallet = makeIcon(_Wallet, 'Wallet');
export const WalletAdd = makeIcon(_WalletAdd, 'WalletAdd');
export const Webhook = makeIcon(_Webhook, 'Webhook');
export const Wifi = makeIcon(_Wifi, 'Wifi');
export const X = makeIcon(_Cancel, 'X');
export const XCircle = makeIcon(_CancelCircle, 'XCircle');
export const Zap = makeIcon(_Zap, 'Zap');

export type LucideIcon = React.ForwardRefExoticComponent<IconProps & React.RefAttributes<SVGSVGElement>>;
export type LucideProps = IconProps;
