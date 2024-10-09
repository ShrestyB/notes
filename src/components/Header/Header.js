import React from "react";
import { MenuSvg } from "../Helpers/Svg";
import logo from "../../images/logo.png";
import { useLabel } from "../../ContextProviders/LabelContext";
import Search from "../Helpers/SearchBar.js";


export function Header() {
    const { selectedLabel } = useLabel();

    return (
        <div className="header">
            <div className="menu-icon">
                <MenuSvg />
            </div>
            {selectedLabel === "" ? (
                <div className="home-heading">
                    <img className="logo" src={logo} alt="Logo" />
                    <span className="label-heading">NOTIFY</span>
                </div>
            ) : (
                <div className="label-heading">{selectedLabel}</div>
            )}
            {/* <div className="search">
                <Search/>
            </div> */}
        </div>
    );
}
