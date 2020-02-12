import { COMPONENT_TYPE, DIRECTION, LAYER } from '../constant';
import {
  AxisLabelCfg,
  AxisLineCfg,
  AxisSubTickLineCfg,
  AxisTickLineCfg,
  AxisTitleCfg,
  ContinueLegendHandlerCfg,
  ContinueLegendLabelCfg,
  ContinueLegendRailCfg,
  ContinueLegendTrackCfg,
  CrosshairLineCfg,
  CrosshairTextBackgroundCfg,
  CrosshairTextCfg,
  GridLineCfg,
  GroupComponent,
  HtmlComponent,
  ICanvas,
  IGroup,
  LegendBackgroundCfg,
  LegendItemNameCfg,
  LegendItemValueCfg,
  LegendMarkerCfg,
  LegendTitleCfg,
  PathCommand,
  Point,
  ScaleConfig,
} from '../dependents';
import {
  AdjustOption,
  AttributeOption,
  LabelOption,
  StateOption,
  StyleOption,
  TooltipOption as GeometryTooltipOption,
} from '../geometry/interface';
import {
  AnimateCfg,
  Data,
  Datum,
  LooseObject,
  Padding,
  Region,
  Renderer,
  ViewPadding,
} from '../interface';
import {
  ArcOption,
  DataMarkerOption,
  DataRegionOption,
  ImageOption,
  LineOption,
  RegionFilterOption,
  RegionOption,
  TextOption,
 } from './controller/annotation';
import View from './view';

interface TooltipDomStyles {
  'g2-tooltip'?: LooseObject;
  'g2-tooltip-title'?: LooseObject;
  'g2-tooltip-list'?: LooseObject;
  'g2-tooltip-list-item'?: LooseObject;
  'g2-tooltip-marker'?: LooseObject;
  'g2-tooltip-value'?: LooseObject;
  'g2-tooltip-name'?: LooseObject;
}

// 目前组件动画只允许以下参数的配置
interface ComponentAnimateCfg {
  /** 动画执行时间 */
  readonly duration?: number;
  /** 动画缓动函数 */
  readonly easing?: string;
  /** 动画延迟时间 */
  readonly delay?: number;
}

interface ComponentAnimateOption {
  /** 初入场动画配置 */
  appear?: ComponentAnimateCfg;
  /** 更新动画配置 */
  update?: ComponentAnimateCfg;
  /** 更新后新入场的动画配置 */
  enter?: ComponentAnimateCfg;
  /** 离场动画配置 */
  leave?: ComponentAnimateCfg;
}

/** 列定义配置项 */
export interface ScaleOption extends ScaleConfig {
  /** 声明度量类型。  */
  type?: ScaleType;
  /**
   * 同步 scale。
   *
   * @example
   * ```ts
   * chart.scale({
   *   x: { sync: true },
   *   y: { sync: true },
   *   x1: { sync: 'x1' },
   *   x2: { sync: 'x1' },
   * });
   * ```
   *
   * 通过以上配置，我们会分别对 x 和 y 两个字段，x1 和 x2 两个字段进行同步度量操作。
   */
  sync?: boolean | string;
  /**
   * 只对 type: 'time' 的 scale 生效，强制显示最后的日期 tick。
   */
  showLast?: boolean;
}

export interface AnimateOption {
  /** chart 初始化渲染时的入场动画，false/null 表示关闭入场动画。 */
  appear?: AnimateCfg | false | null;
  /** chart 发生更新时，新增元素的入场动画，false/null 表示关闭入场动画。 */
  enter?: AnimateCfg | false | null;
  /** 更新动画配置，false/null 表示关闭更新动画。 */
  update?: AnimateCfg | false | null;
  /** 销毁动画配置，false/null 表示关闭销毁动画。 */
  leave?: AnimateCfg | false | null;
}

// 用于配置项式声明交互行为
export interface InteractionOption {
  /** 交互名称 */
  type: string;
  /** 交互配置 */
  cfg?: LooseObject;
}

// 用于配置项式的创建方式
export interface GeometryOption {
  /** Geometry 的类型。 */
  type: 'interval' | 'line' | 'path' | 'point' | 'area' | 'polygon' | 'schema' | 'edge' | 'heatmap' | string;
  /** position 通道映射规则，对应 `geometry.position()`。 */
  position: string | AttributeOption;
  /** color 通道映射规则，对应 `geometry.color()`。 */
  color?: string | AttributeOption;
  /** shape 通道映射规则，对应 `geometry.shape()`。 */
  shape?: string | AttributeOption;
  /** size 通道映射规则，对应 `geometry.size()`。 */
  size?: number | string | AttributeOption;
  /** adjust 数据调整方式，对应 `geometry.adjust()`。 */
  adjust?: string | string[] | AdjustOption | AdjustOption[];
  /** style 样式配置，对应 `geometry.size()`。 */
  style?: StyleOption | LooseObject;
  /** tooltip 配置，对应 `geometry.tooltip()`。 */
  tooltip?: GeometryTooltipOption | boolean | string;
  /** Geometry 动画配置，对应 `geometry.animate()`。 */
  animate?: AnimateOption | boolean;
  /** Label 配置，对应 `geometry.label()`。 */
  label?: LabelOption | false | string;
  /** state 样式配置，对应 `geometry.state()`。 */
  state?: StateOption;
  /** 其他配置 */
  cfg?: {
    /** 是否对数据进行排序 */
    sortable?: boolean;
    /** 是否可见 */
    visible?: boolean;
    /** 是否连接空值，仅对 'line', 'area' 和 'path' 生效 */
    connectNulls?: boolean;
  };
}

// 用于配置型式的声明方式
export interface ViewOption {
  /** view 的绘制范围，起始点为左上角。 */
  readonly region?: Region;
  /**
   * 设置图表的内边距，使用方式参考 CSS 盒模型。
   * 下图黄色区域即为 padding 的范围。
   * ![](https://gw.alipayobjects.com/mdn/rms_2274c3/afts/img/A*pYwiQrdXGJ8AAAAAAAAAAABkARQnAQ)
   *
   * @example
   * 1. padding: 20
   * 2. padding: [ 10, 30, 30 ]
   */
  readonly padding?: Padding;
  /** 设置主题。 */
  readonly theme?: object | string;
  /** 是否可见。 */
  readonly visible?: boolean;
  /**
   * 图表组件、图形映射等相关的配置。
   */
  readonly options?: Options;
}

// chart 构造方法的入参
export interface ChartCfg {
  /** 指定 chart 绘制的 DOM，可以传入 DOM id，也可以直接传入 dom 实例。 */
  readonly container: string | HTMLElement;
  /** 图表宽度。 */
  readonly width?: number;
  /** 图表高度。 */
  readonly height?: number;
  /**
   * 图表是否自适应容器宽高，默认为 false，用户需要手动设置 width 和 height。
   * 当 `autoFit: true` 时，会自动取图表容器的宽高，如果用户设置了 height，那么会以用户设置的 height 为准。
   */
  readonly autoFit?: boolean;
  /** 指定渲染引擎，默认使用 canvas。 */
  readonly renderer?: Renderer;
  /** 设置设备像素比，默认取浏览器的值 `window.devicePixelRatio`。 */
  readonly pixelRatio?: number;
  /**
   * 设置图表的内边距，使用方式参考 CSS 盒模型。
   * 下图黄色区域即为 padding 的范围。
   * ![](https://gw.alipayobjects.com/mdn/rms_2274c3/afts/img/A*pYwiQrdXGJ8AAAAAAAAAAABkARQnAQ)
   *
   * @example
   * 1. padding: 20
   * 2. padding: [ 10, 30, 30 ]
   */
  readonly padding?: ViewPadding;
  /**
   * 是否开启局部刷新，默认开启。
   */
  readonly localRefresh?: boolean;
  /**
   * chart 是否可见，默认为 true，设置为 false 则会隐藏。
   */
  readonly visible?: boolean;
  /**
   * 当使用配置项式创建 chart 时使用，详见 [配置项式创建图表教程](docs/tutorial/schema)。
   */
  readonly options?: Options;
  /**
   * 配置图表默认交互，仅支持字符串形式。
   */
  defaultInteractions?: string[];
}

// view 构造参数
export interface ViewCfg {

  /** 当前 view 的父级 view。 */
  readonly parent: View;
  /** canvas 实例。 */
  readonly canvas: ICanvas;
  /** 前景层 */
  readonly foregroundGroup: IGroup;
  /** 中间层 */
  readonly middleGroup: IGroup;
  /** 背景层 */
  readonly backgroundGroup: IGroup;
  /** view 的绘制范围 */
  readonly region?: Region;
  /**
   * 设置图表的内边距，使用方式参考 CSS 盒模型。
   * 下图黄色区域即为 padding 的范围。
   * ![](https://gw.alipayobjects.com/mdn/rms_2274c3/afts/img/A*pYwiQrdXGJ8AAAAAAAAAAABkARQnAQ)
   *
   * @example
   * 1. padding: 20
   * 2. padding: [ 10, 30, 30 ]
   */
  readonly padding?: ViewPadding;
  /** 设置 view 实例主题。 */
  readonly theme?: object | string;
  /**
   * 图表组件、图形映射等相关的配置。
   */
  readonly options?: Options;
  /** 是否可见。 */
  readonly visible?: boolean;
  readonly start?: Point;
  readonly end?: Point;
}

/**
 * @ignore
 * 组件及布局的信息
 */
export interface ComponentOption {
  readonly id?: string;
  readonly component: GroupComponent | HtmlComponent;
  readonly layer: LAYER;
  direction: DIRECTION;
  readonly type: COMPONENT_TYPE;
  /* 其他的额外信息 */
  readonly extra?: any;
}

interface MarkerCfg extends LegendMarkerCfg {
  /** 配置图例 marker 的 symbol 形状。 */
  symbol?: Marker | MarkerCallback;
}

export interface LegendItem {
  /**
   * 唯一值，用于动画或者查找
   */
  id?: string;
  /** 名称 */
  name: string;
  /** 值 */
  value: any;
  /** 图形标记 */
  marker?: MarkerCfg;
}

/**
 * 图例项配置
 */
export interface LegendCfg {
  /**
   * 是否为自定义图例，当该属性为 true 时，需要声明 items 属性。
   */
  readonly custom?: boolean;
  /**
   * 布局方式： horizontal，vertical
   */
  layout?: 'horizontal' | 'vertical';
  /**
   * 图例标题配置，默认不展示。
   */
  title?: LegendTitleCfg;
  /**
   * 背景框配置项。
   */
  background?: LegendBackgroundCfg;
  /** 图例的位置。 */
  position?:
    | 'top'
    | 'top-left'
    | 'top-right'
    | 'right'
    | 'right-top'
    | 'right-bottom'
    | 'left'
    | 'left-top'
    | 'left-bottom'
    | 'bottom'
    | 'bottom-left'
    | 'bottom-right';
  /** 动画开关，默认关闭。 */
  animate?: boolean;
  /** 动画参数配置，当且仅当 `animate` 属性为 true，即动画开启时生效。 */
  animateOption?: ComponentAnimateOption;
  /**
   * **分类图例适用**，控制图例项水平方向的间距。
   */
  itemSpacing?: number;
  /**
   * **分类图例适用**，图例项的宽度, 默认为 null，自动计算。
   */
  itemWidth?: number;
  /**
   * **分类图例适用**，图例的高度，默认为 null。
   */
  itemHeight?: number;
  /**
   * **分类图例适用**，图例项 name 文本的配置。
   */
  itemName?: LegendItemNameCfg;
  /**
   * **分类图例适用**，图例项 value 附加值的配置项。
   */
  itemValue?: LegendItemValueCfg;
  /**
   * **分类图例适用**，图例项最大宽度设置。
   */
  maxWidth?: number;
  /**
   * **分类图例适用**，图例项最大高度设置。
   */
  maxHeight?: number;
  /**
   * **分类图例适用**，图例项的 marker 图标的配置。
   */
  marker?: MarkerCfg;
  /**
   * **适用于分类图例**，当图例项过多时是否进行分页。
   */
  flipPage?: boolean;
  /**
   * **分类图例适用**，用户自己配置图例项的内容。
   */
  items?: LegendItem[];
  /**
   * **分类图例适用**，是否将图例项逆序展示。
   */
  reversed?: boolean;

  /**
   * **连续图例适用**，选择范围的最小值。
   */
  min?: number;
  /**
   * **连续图例适用**，选择范围的最大值。
   */
  max?: number;
  /**
   * **连续图例适用**，选择的值。
   */
  value?: number[];
  /**
   * **连续图例适用**，选择范围的色块样式配置项。
   */
  track?: ContinueLegendTrackCfg;
  /**
   * **连续图例适用**，图例滑轨（背景）的样式配置项。
   */
  rail?: ContinueLegendRailCfg;
  /**
   * **连续图例适用**，文本的配置项。
   */
  label?: ContinueLegendLabelCfg;
  /**
   * **连续图例适用**，滑块的配置项。
   */
  handler?: ContinueLegendHandlerCfg;
  /**
   * **连续图例适用**，滑块是否可以滑动。
   */
  slidable?: boolean;
  /** 图例 x 方向的偏移。 */
  offsetX?: number;
  /** 图例 y 方向的偏移。 */
  offsetY?: number;
}

interface TooltipCrosshairsText extends CrosshairTextCfg {
  /** crosshairs 文本内容 */
  content?: string;
}

/**
 * 辅助线文本回调函数
 * @param type 对应当前 crosshairs 的类型，值为 'x' 或者 'x'
 * @param defaultContent 对应当前 crosshairs 默认的文本内容
 * @param items 对应当前 tooltip 内容框中的数据
 * @param currentPoint 对应当前坐标点
 * @returns 返回当前 crosshairs 对应的辅助线文本配置
 */
type TooltipCrosshairsTextCallback = (type: string, defaultContent: any, items: any[], currentPoint: Point) => TooltipCrosshairsText;
export interface TooltipCrosshairs {
  /**
   * crosshairs 的类型: `x` 表示 x 轴上的辅助线，`y` 表示 y 轴上的辅助项。
   * 以下是在不同坐标系下，crosshairs 各个类型的表现：
   *
   * | 坐标系 | type = 'x' | type = 'xy' | type = 'y' |
   * | ------------ | ------------- | ------------- |
   * | 直角坐标系  | ![image](https://gw.alipayobjects.com/mdn/rms_2274c3/afts/img/A*jmUBQ4nbtXsAAAAAAAAAAABkARQnAQ) | ![image](https://gw.alipayobjects.com/mdn/rms_2274c3/afts/img/A*RpWXT76ZSQgAAAAAAAAAAABkARQnAQ) | ![image](https://gw.alipayobjects.com/mdn/rms_2274c3/afts/img/A*Xjl8TLIJLuUAAAAAAAAAAABkARQnAQ) |
   * | 极坐标 | ![image](https://gw.alipayobjects.com/mdn/rms_2274c3/afts/img/A*zbMVSoKTyFsAAAAAAAAAAABkARQnAQ) | ![image](https://gw.alipayobjects.com/mdn/rms_2274c3/afts/img/A*k5EYRJspET0AAAAAAAAAAABkARQnAQ) | ![image](https://gw.alipayobjects.com/mdn/rms_2274c3/afts/img/A*n_TKQpUaXWEAAAAAAAAAAABkARQnAQ) |
   */
  type?: 'x' | 'y' | 'xy';
  /** 辅助线的样式配置。 */
  line?: CrosshairLineCfg;
  /**
   * 辅助线文本配置，支持回调。
   */
  text?: TooltipCrosshairsText | TooltipCrosshairsTextCallback;
  /** 辅助线文本背景配置。 */
  textBackground?: CrosshairTextBackgroundCfg;
}

export interface TooltipCfg {
  /** 设置 tooltip 是否跟随鼠标移动，默认为 false, 定位到数据点。 */
  follow?: boolean;
  /** 是否展示 tooltip 标题。 */
  showTitle?: boolean;
  /**
   * 设置 tooltip 的标题内容：如果值为数据字段名，则会展示数据中对应该字段的数值，如果数据中不存在该字段，则直接展示 title 值。
   */
  title?: string;
  /** 设置 tooltip 的固定展示位置，相对于数据点。 */
  position?: 'top' | 'bottom' | 'left' | 'right';
  /** true 表示合并当前点对应的所有数据并展示，false 表示只展示离当前点最逼近的数据内容。 */
  shared?: boolean; // 是否只展示单条数据
  /** 是否展示 crosshairs。 */
  showCrosshairs?: boolean;
  /** 配置 tooltip 的 crosshairs，当且仅当 `showCrosshairs` 为 true 时生效。 */
  crosshairs?: TooltipCrosshairs;
  /** 是否渲染 tooltipMarkers。 */
  showMarkers?: boolean;
  /** tooltipMarker 的样式配置。 */
  marker?: object;
  /** 自定义 tooltip 的容器。 */
  container?: string | HTMLElement;
  /** 用于指定图例容器的模板，自定义模板时必须包含各个 dom 节点的 class。 */
  containerTpl?: string;
  /** 每项记录的默认模板，自定义模板时必须包含各个 dom 节点的 class。 */
  itemTpl?: string;
  /** 传入各个 dom 的样式。 */
  domStyles?: TooltipDomStyles;
  /** tooltip 偏移量。 */
  offset?: number;
}

/** 坐标系配置 */
export interface CoordinateOption {
  /** 坐标系类型 */
  type?: 'polar' | 'theta' | 'rect' | 'cartesian' | 'helix';
  /** 坐标系配置项，目前常用于极坐标。 */
  cfg?: CoordinateCfg;
  /**
   * 坐标系变换操作:
   * 1. rotate 表示旋转，使用弧度制。
   * 2. scale 表示沿着 x 和 y 方向的缩放比率。
   * 3. reflect 表示沿 x 方向镜像或者沿 y 轴方向映射。
   * 4. transpose 表示 x，y 轴置换。
   */
  actions?: CoordinateActions[];
}

export interface CoordinateCfg {
  /**
   * 用于极坐标，配置起始弧度。
   */
  startAngle?: number;
  /**
   * 用于极坐标，配置结束弧度。
   */
  endAngle?: number;
  /**
   * 用于极坐标，配置极坐标半径，0 - 1 范围的数值。
   */
  radius?: number;
  /**
   * 用于极坐标，极坐标内半径，0 -1 范围的数值。
   */
  innerRadius?: number;
}

export interface AxisGridCfg {
  /**
   * 线的样式。
   */
  line?: GridLineCfg;
  /**
   * 两个栅格线间的填充色。
   */
  alternateColor?: string | string[];
  /**
   * 对于 circle 是否关闭 grid。
   */
  closed?: boolean;
  /**
   * 是否同刻度线对齐，如果值为 false，则会显示在两个刻度中间。
   * ![image](https://gw.alipayobjects.com/mdn/rms_2274c3/afts/img/A*YX6fS4GTTvMAAAAAAAAAAABkARQnAQ)
   */
  alignTick?: boolean;
}

export interface AxisCfg {
  /**
   * 适用于直角坐标系，设置坐标轴的位置。
   */
  position?: 'top' | 'bottom' | 'right' | 'left';
  /**
   * 坐标轴线的配置项，null 表示不展示。
   */
  line?: AxisLineCfg | null;
  /**
   * 坐标轴刻度线线的配置项，null 表示不展示。
   */
  tickLine?: AxisTickLineCfg | null;
  /**
   * 坐标轴子刻度线的配置项，null 表示不展示。
   */
  subTickLine?: AxisSubTickLineCfg | null;
  /**
   * 标题的配置项，null 表示不展示。
   */
  title?: AxisTitleCfg | null;
  /**
   * 文本标签的配置项，null 表示不展示。
   */
  label?: AxisLabelCfg | null;
  /** 坐标轴网格线的配置项，null 表示不展示。 */
  grid?: AxisGridCfg | null;
  /** 动画开关，默认开启。 */
  animate?: boolean;
  /** 动画参数配置。 */
  animateOption?: ComponentAnimateOption;
  /** 标记坐标轴 label 的方向，左侧为 1，右侧为 -1。 */
  verticalFactor?: number;
}

export interface Options {
  /** 数据源配置。 */
  readonly data: Data;
  /** 设置数据过滤条件，以 data 中的数据属性为 key。 */
  readonly filters?: Record<string, FilterCondition>;
  /** 坐标轴配置，以 data 中的数据属性为 key。 */
  readonly axes?: Record<string, AxisOption> | boolean;
  /** 图例配置，以 data 中的数据属性为 key。 */
  readonly legends?: Record<string, LegendOption> | boolean;
  /** 列定义配置，用于配置数值的类型等，以 data 中的数据属性为 key。 */
  readonly scales?: Record<string, ScaleOption>;
  /** Tooltip 配置。 */
  readonly tooltip?: TooltipOption;
  /** 坐标系配置。 */
  readonly coordinate?: CoordinateOption;
  /** 静态辅助元素声明。 */
  readonly annotations?: Array<
    ArcOption |
    RegionFilterOption |
    ImageOption |
    LineOption |
    TextOption |
    RegionOption |
    DataMarkerOption |
    DataRegionOption>;
  /** Geometry 配置 */
  readonly geometries?: GeometryOption[];
  /** 开启/关闭动画，默认开启 */
  readonly animate?: boolean;
  /** 配置需要使用的交互行为 */
  readonly interactions?: InteractionOption[];

  /** 其他自定义的 option */
  readonly [name: string]: any;

  /** 子 View */
  readonly views?: ViewOption[];
}

type Marker =
  | 'circle'
  | 'square'
  | 'diamond'
  | 'triangle'
  | 'triangleDown'
  | 'hexagon'
  | 'bowtie'
  | 'cross'
  | 'tick'
  | 'plus'
  | 'hyphen'
  | 'line';
type MarkerCallback = (x: number, y: number, r: number) => PathCommand;
export type TooltipOption = TooltipCfg | boolean;
/* 筛选器函数类型定义 */
export type FilterCondition = (value: any, datum: Datum) => boolean;
export type AxisOption = AxisCfg | boolean;
export type LegendOption = LegendCfg | boolean;
export type ScaleType =
  'linear' |
  'cat' |
  'category' |
  'identity' |
  'log' |
  'pow' |
  'time' |
  'timeCat' |
  'quantize' |
  'quantile';

type CoordinateRotate = ['rotate', number];
type CoordinateReflect = ['reflect', 'x' | 'y'];
type CoordinateScale = ['scale', number, number];
type CoordinateTranspose = ['transpose'];
export type CoordinateActions = CoordinateRotate | CoordinateReflect | CoordinateScale | CoordinateTranspose;
