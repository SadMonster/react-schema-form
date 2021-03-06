// @flow
import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import MuiSelect from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Chip from "@material-ui/core/Chip";
import ComposedComponent from "./ComposedComponent";
import utils from "./utils";

const styles = theme => ({
    root: {
        display: "flex",
        flexWrap: "wrap"
    },
    chips: {
        display: "flex",
        flexWrap: "wrap"
    },
    chip: {
        margin: theme.spacing.unit / 4
    },
    menuItem: {
        fontWeight: theme.typography.fontWeightRegular
    },
    selectedMenuItem: {
        fontWeight: theme.typography.fontWeightMedium
    }
});

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250
        }
    }
};

type Props = {
    model: any,
    form: any,
    onChangeValidate: any,
    classes: any
};

type State = {
    currentValue: any
};

class MultiSelect extends Component<Props, State> {
    constructor(props) {
        super(props);
        const { model, form } = this.props;
        this.state = {
            currentValue: utils.getValueFromModel(model, form.key) || []
        };
    }

    static getDerivedStateFromProps(props: Props) {
        if (props.model && props.form.key) {
            return {
                currentValue:
                    utils.getValueFromModel(props.model, props.form.key) || []
            };
        }
        return null;
    }

    onSelected = event => {
        const { onChangeValidate } = this.props;
        const currentValue = event.target.value;
        this.setState({ currentValue });
        onChangeValidate(currentValue);
    };

    render() {
        const { form, classes } = this.props;
        const { currentValue } = this.state;
        const getTitle = utils.getTitleByValue.bind(this, form.titleMap);
        const menuItems = form.titleMap.map(item => (
            <MenuItem
                key={item.value}
                value={item.value}
                className={
                    currentValue.indexOf(item.value) === -1
                        ? classes.menuItem
                        : classes.selectedMenuItem
                }
            >
                {item.name}
            </MenuItem>
        ));
        return (
            <FormControl fullWidth>
                <InputLabel>{form.title}</InputLabel>
                <MuiSelect
                    multiple
                    value={currentValue || ""}
                    placeholder={form.title}
                    disabled={form.readonly}
                    onChange={this.onSelected}
                    MenuProps={MenuProps}
                    renderValue={selected => (
                        <div className={classes.chips}>
                            {selected.map(value => (
                                <Chip
                                    key={value}
                                    label={getTitle(value)}
                                    className={classes.chip}
                                />
                            ))}
                        </div>
                    )}
                >
                    {menuItems}
                </MuiSelect>
            </FormControl>
        );
    }
}

export default ComposedComponent(withStyles(styles)(MultiSelect));
