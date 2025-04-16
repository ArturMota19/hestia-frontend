// Components
// Images
import houseIcon from "../../assets/icons/house-icon.svg";
// Imports
import Button from "../../basics/Button/Button";
import { useTranslation } from "react-i18next";
//Styles
import s from "./ViewComponent.module.scss";

export default function ViewComponent({
	index,
	title,
	text,
	type, 
	hasActions = false,
}) {
  const { t } = useTranslation();
  const columns = 2;
	const row = Math.floor(index / columns);
	const col = index % columns;
	const isEvenRow = row % 2 === 0;

	const isColorA = (isEvenRow && col === 0) || (!isEvenRow && col === 1);

	return (
		<div
			key={index}
			className={
				isColorA
					? `${s.wrapperViewComponent} ${s.oddColor}`
					: `${s.wrapperViewComponent} ${s.evenColor}`
			}
		>
			<div className={s.wrapperInfo}>
				<h5>{title}</h5>
				<p>{text}</p>
        {hasActions &&
          <div className={s.buttonsDiv}>
            <Button 
            text={t('edit')} 
            backgroundColor={"secondary"} 
            height={36}
            doFunction={console.log("edit")}/>
            <Button 
            text={t('delete')} 
            backgroundColor={"delete"} 
            height={36}
            doFunction={console.log("delete")}/>
          </div>
        }
			</div>
			<img src={type == "preset" ? houseIcon : "/"} />
		</div>
	);
}
