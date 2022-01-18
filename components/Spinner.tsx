import style from '../styles/spinner.module.css'

/** 로딩중일때 표시되는 스피너입니다. */
export default function Spinner () {
  return (
    <svg className={style.spinner} viewBox="0 0 50 50">
      <circle
        className={style.path}
        cx="25" cy="25" r="20"
        fill="none" strokeWidth="5"/>
    </svg>
  )
}
