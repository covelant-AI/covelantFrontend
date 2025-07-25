import {RadialBlurBgProps} from '@/util/interfaces'

export default function RadialBlurBg({ width, height, rotate, top, left, bottom, right, background }: RadialBlurBgProps) {
    return (
        <div 
        className="absolute inset-0 z-1"
        style={{
          background: background,
          width: width,
          height: height,
          rotate: rotate,
          top: top,
          left: left,
          bottom: bottom,
          right: right,
      }}
      />
    );
}