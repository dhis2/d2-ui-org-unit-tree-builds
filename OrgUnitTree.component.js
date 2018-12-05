import _Object$assign from 'babel-runtime/core-js/object/assign';
import _extends from 'babel-runtime/helpers/extends';
import _Promise from 'babel-runtime/core-js/promise';
import _Object$getPrototypeOf from 'babel-runtime/core-js/object/get-prototype-of';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React from 'react';
import PropTypes from 'prop-types';
import LinearProgress from '@material-ui/core/LinearProgress';
import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import FolderIcon from '@material-ui/icons/Folder';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import StopIcon from '@material-ui/icons/Stop';

import ModelBase from 'd2/model/Model';
import ModelCollection from 'd2/model/ModelCollection';

import TreeView from '@dhis2/d2-ui-core/tree-view/TreeView.component';

var styles = {
    progress: {
        position: 'absolute',
        display: 'inline-block',
        width: '100%',
        left: -8
    },
    progressBar: {
        height: 2,
        backgroundColor: 'transparent'
    },
    spacer: {
        position: 'relative',
        display: 'inline-block',
        width: '1.2rem',
        height: '1rem'
    },
    label: {
        display: 'inline-block',
        outline: 'none'
    },
    ouContainer: {
        borderColor: 'transparent',
        borderStyle: 'solid',
        borderWidth: '1px',
        borderRightWidth: 0,
        borderRadius: '3px 0 0 3px',
        background: 'transparent',
        paddingLeft: 2,
        outline: 'none'
    },
    currentOuContainer: {
        background: 'rgba(0,0,0,0.05)',
        borderColor: 'rgba(0,0,0,0.1)'
    },
    memberCount: {
        fontSize: '0.75rem',
        marginLeft: 4
    },
    checkbox: {
        position: 'relative',
        bottom: 2,
        padding: 0
    },
    uncheckedCheckbox: {
        fontSize: 15,
        color: '#E0E0E0'
    }
};

var OrgUnitTree = function (_React$Component) {
    _inherits(OrgUnitTree, _React$Component);

    function OrgUnitTree(props) {
        _classCallCheck(this, OrgUnitTree);

        var _this = _possibleConstructorReturn(this, (OrgUnitTree.__proto__ || _Object$getPrototypeOf(OrgUnitTree)).call(this, props));

        _this.onCollapse = function (orgUnit) {
            if (typeof _this.props.onCollapse === 'function') {
                _this.props.onCollapse(orgUnit);
            }
        };

        _this.onExpand = function (orgUnit) {
            _this.loadChildren();

            if (typeof _this.props.onExpand === 'function') {
                _this.props.onExpand(orgUnit);
            }
        };

        _this.state = {
            children: props.root.children === false || Array.isArray(props.root.children) && props.root.children.length === 0 ? [] : undefined,
            loading: false
        };
        if (props.root.children instanceof ModelCollection && !props.root.children.hasUnloadedData) {
            _this.state.children = props.root.children.toArray()
            // Sort here since the API returns nested children in random order
            .sort(function (a, b) {
                return a.displayName.localeCompare(b.displayName);
            });
        }

        _this.loadChildren = _this.loadChildren.bind(_this);
        _this.handleSelectClick = _this.handleSelectClick.bind(_this);
        return _this;
    }

    _createClass(OrgUnitTree, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            var _this2 = this;

            if (this.props.initiallyExpanded.some(function (ou) {
                return ou.includes('/' + _this2.props.root.id);
            })) {
                this.loadChildren();
            }
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(newProps) {
            if (newProps.initiallyExpanded.some(function (ou) {
                return ou.includes('/' + newProps.root.id);
            }) || newProps.idsThatShouldBeReloaded.includes(newProps.root.id)) {
                this.loadChildren();
            }
        }
    }, {
        key: 'setChildState',
        value: function setChildState(children) {
            var data = children;

            if (this.props.onChildrenLoaded) {
                this.props.onChildrenLoaded(children);
            }

            if (!Array.isArray(children)) {
                data = children.toArray();
            }

            this.setState({
                children: data.sort(function (a, b) {
                    return a.displayName.localeCompare(b.displayName);
                }),
                loading: false
            });
        }
    }, {
        key: 'hideChildren',
        value: function hideChildren() {
            this.setChildState([]);
        }
    }, {
        key: 'loadChildren',
        value: function loadChildren() {
            var _this3 = this;

            return new _Promise(function (resolve) {
                if (_this3.state.children === undefined && !_this3.state.loading || _this3.props.idsThatShouldBeReloaded.indexOf(_this3.props.root.id) >= 0) {
                    _this3.setState({ loading: true });

                    var root = _this3.props.root;
                    // d2.ModelCollectionProperty.load takes a second parameter `forceReload` and will just return
                    // the current valueMap unless either `this.hasUnloadedData` or `forceReload` are true
                    root.children.load({
                        fields: ['id', _this3.props.displayNameProperty + '~rename(displayName)', 'children::isNotEmpty', 'path', 'parent'].join(',')
                    }, _this3.props.forceReloadChildren).then(function (children) {
                        resolve(children);
                        _this3.setChildState(children);
                    });
                }

                if (_this3.state.children !== undefined) {
                    resolve(_this3.state.children);
                }
            });
        }
    }, {
        key: 'handleSelectClick',
        value: function handleSelectClick(e) {
            if (this.props.onSelectClick) {
                this.props.onSelectClick(e, this.props.root);
            }
            e.stopPropagation();
        }
    }, {
        key: 'shouldIncludeOrgUnit',
        value: function shouldIncludeOrgUnit(orgUnit) {
            if (!this.props.orgUnitsPathsToInclude || this.props.orgUnitsPathsToInclude.length === 0) {
                return true;
            }
            return !!this.props.orgUnitsPathsToInclude.some(function (ou) {
                return ou.includes('/' + orgUnit.id);
            });
        }
    }, {
        key: 'renderChild',
        value: function renderChild(orgUnit, expandedProp) {
            if (this.shouldIncludeOrgUnit(orgUnit)) {
                var highlighted = this.props.searchResults.includes(orgUnit.path) && this.props.highlightSearchResults;

                return React.createElement(OrgUnitTree, {
                    key: orgUnit.id,
                    root: orgUnit,
                    onExpand: this.onExpand,
                    onCollapse: this.onCollapse,
                    selected: this.props.selected,
                    initiallyExpanded: expandedProp,
                    onSelectClick: this.props.onSelectClick,
                    onContextMenuClick: this.props.onContextMenuClick,
                    currentRoot: this.props.currentRoot,
                    onChangeCurrentRoot: this.props.onChangeCurrentRoot,
                    labelStyle: _extends({}, this.props.labelStyle, {
                        fontWeight: highlighted ? 500 : this.props.labelStyle.fontWeight,
                        color: highlighted ? 'orange' : 'inherit'
                    }),
                    selectedLabelStyle: this.props.selectedLabelStyle,
                    arrowSymbol: this.props.arrowSymbol,
                    idsThatShouldBeReloaded: this.props.idsThatShouldBeReloaded,
                    hideCheckboxes: this.props.hideCheckboxes,
                    onChildrenLoaded: this.props.onChildrenLoaded,
                    hideMemberCount: this.props.hideMemberCount,
                    orgUnitsPathsToInclude: this.props.orgUnitsPathsToInclude,
                    treeStyle: this.props.treeStyle,
                    searchResults: this.props.searchResults,
                    highlightSearchResults: this.props.highlightSearchResults,
                    forceReloadChildren: this.props.forceReloadChildren,
                    showFolderIcon: this.props.showFolderIcon,
                    disableSpacer: this.props.disableSpacer,
                    checkboxColor: this.props.checkboxColor,
                    displayNameProperty: this.props.displayNameProperty
                });
            }
            return null;
        }
    }, {
        key: 'renderChildren',
        value: function renderChildren() {
            var _this4 = this;

            // If initiallyExpanded is an array, remove the current root id and pass the rest on
            // If it's a string, pass it on unless it's the current root id
            var expandedProp = Array.isArray(this.props.initiallyExpanded) ? this.props.initiallyExpanded.filter(function (id) {
                return id !== _this4.props.root.id;
            }) : this.props.initiallyExpanded !== this.props.root.id && this.props.initiallyExpanded || [];

            if (Array.isArray(this.state.children) && this.state.children.length > 0) {
                return this.state.children.map(function (orgUnit) {
                    return _this4.renderChild(orgUnit, expandedProp);
                });
            }

            if (this.state.loading) {
                return React.createElement(
                    'div',
                    { style: styles.progress },
                    React.createElement(LinearProgress, { style: styles.progressBar })
                );
            }

            return null;
        }
    }, {
        key: 'render',
        value: function render() {
            var _this5 = this;

            var currentOu = this.props.root;

            // True if this OU has children = is not a leaf node
            var hasChildren = this.state.children === undefined || Array.isArray(this.state.children) && this.state.children.length > 0;
            // True if a click handler exists
            var isSelectable = !!this.props.onSelectClick;
            var pathRegEx = new RegExp('/' + currentOu.id + '$');
            var memberRegEx = new RegExp('/' + currentOu.id);
            var isSelected = this.props.selected && this.props.selected.some(function (ou) {
                return pathRegEx.test(ou);
            });
            // True if this OU is the current root
            var isCurrentRoot = this.props.currentRoot && this.props.currentRoot.id === currentOu.id;
            // True if this OU should be expanded by default
            var isInitiallyExpanded = this.props.initiallyExpanded.some(function (ou) {
                return ou.includes('/' + currentOu.id);
            });
            // True if this OU can BECOME the current root, which means that:
            // 1) there is a change root handler
            // 2) this OU is not already the current root
            // 3) this OU has children (is not a leaf node)
            var canBecomeCurrentRoot = this.props.onChangeCurrentRoot && !isCurrentRoot && hasChildren;

            var memberCount = this.props.selected !== undefined ? this.props.selected.filter(function (ou) {
                return memberRegEx.test(ou);
            }).length : currentOu.memberCount;

            // Hard coded styles for OU name labels - can be overridden with the selectedLabelStyle and labelStyle props
            var labelStyle = _Object$assign({}, styles.label, {
                fontWeight: isSelected ? 500 : 300,
                color: isSelected ? 'orange' : 'inherit',
                cursor: canBecomeCurrentRoot ? 'pointer' : 'default'
            }, isSelected ? this.props.selectedLabelStyle : this.props.labelStyle);

            // Styles for this OU and OUs contained within it
            var ouContainerStyle = _Object$assign({}, styles.ouContainer, isCurrentRoot ? styles.currentOuContainer : {}, this.props.treeStyle);

            // Wrap the change root click handler in order to stop event propagation
            var setCurrentRoot = function setCurrentRoot(e) {
                e.stopPropagation();
                _this5.props.onChangeCurrentRoot(currentOu);
            };

            var onContextMenuClick = function onContextMenuClick(e) {
                e.preventDefault();
                e.stopPropagation();

                if (_this5.props.onContextMenuClick !== undefined) {
                    _this5.props.onContextMenuClick(e, currentOu, hasChildren, _this5.loadChildren);
                }
            };

            var label = React.createElement(
                'div',
                {
                    style: labelStyle,
                    onClick: canBecomeCurrentRoot ? setCurrentRoot : isSelectable ? this.handleSelectClick : undefined,
                    onContextMenu: onContextMenuClick,
                    role: 'button',
                    tabIndex: 0
                },
                isSelectable && !this.props.hideCheckboxes && React.createElement(Checkbox, {
                    style: styles.checkbox,
                    checked: isSelected,
                    disabled: !isSelectable,
                    onClick: this.handleSelectClick,
                    color: this.props.checkboxColor,
                    icon: React.createElement(CheckBoxOutlineBlankIcon, { style: styles.uncheckedCheckbox }),
                    checkedIcon: React.createElement(CheckBoxIcon, { style: { fontSize: 15 } })
                }),
                this.props.showFolderIcon && hasChildren && (isInitiallyExpanded ? React.createElement(FolderOpenIcon, { style: _extends({}, styles.folderIcon, this.props.labelStyle.folderIcon) }) : React.createElement(FolderIcon, { style: _extends({}, styles.folderIcon, this.props.labelStyle.folderIcon) })),
                this.props.showFolderIcon && !hasChildren && React.createElement(StopIcon, { style: _extends({}, styles.stopIcon, this.props.labelStyle.stopIcon) }),
                React.createElement(
                    'span',
                    { style: this.props.labelStyle.text },
                    currentOu.displayName
                ),
                hasChildren && !this.props.hideMemberCount && !!memberCount && React.createElement(
                    'span',
                    { style: styles.memberCount },
                    '(',
                    memberCount,
                    ')'
                )
            );

            if (hasChildren) {
                return React.createElement(
                    TreeView,
                    {
                        label: label,
                        onExpand: this.onExpand,
                        onCollapse: this.onCollapse,
                        model: this.props.root,
                        initiallyExpanded: isInitiallyExpanded,
                        arrowSymbol: this.props.arrowSymbol,
                        className: 'orgunit with-children',
                        style: ouContainerStyle,
                        persistent: true
                    },
                    this.renderChildren()
                );
            }

            return React.createElement(
                'div',
                {
                    onClick: isSelectable ? this.handleSelectClick : undefined,
                    className: 'orgunit without-children',
                    style: ouContainerStyle,
                    role: 'button',
                    tabIndex: 0
                },
                !this.props.disableSpacer && React.createElement('div', { style: styles.spacer }),
                label
            );
        }
    }]);

    return OrgUnitTree;
}(React.Component);

function orgUnitPathPropValidator(propValue, key, compName, location, propFullName) {
    if (!/(\/[a-zA-Z][a-zA-Z0-9]{10})+/.test(propValue[key])) {
        return new Error('Invalid org unit path `' + propValue[key] + '` supplied to `' + compName + '.' + propFullName + '`');
    }
    return undefined;
}

OrgUnitTree.propTypes = {
    /**
     * The root OrganisationUnit of the tree
     *
     * If the root OU is known to have no children, the `children` property of the root OU should be either
     * `false` or an empty array. If the children property is undefined, the children will be fetched from
     * the server when the tree is expanded.
     */
    root: PropTypes.instanceOf(ModelBase).isRequired,

    /**
     * Display name property
     */
    displayNameProperty: PropTypes.string,

    /**
     * An array of paths of selected OUs
     *
     * The path of an OU is the UIDs of the OU and all its parent OUs separated by slashes (/)
     */
    selected: PropTypes.arrayOf(orgUnitPathPropValidator),

    /**
     * An array of OU paths that will be expanded automatically as soon as they are encountered
     *
     * The path of an OU is the UIDs of the OU and all its parent OUs separated by slashes (/)
     */
    initiallyExpanded: PropTypes.arrayOf(orgUnitPathPropValidator),

    /**
     * onExpand callback is triggered when user expands organisation unit
     *
     * Will receive one argument - OU that was expanded
     */
    onExpand: PropTypes.func,

    /**
     * onCollapse callback is triggered when user collapses organisation unit
     *
     * Will receive one argument - OU that was collapsed
     */
    onCollapse: PropTypes.func,

    /**
     * onSelectClick callback, which is triggered when a click triggers the selection of an organisation unit
     *
     * The onSelectClick callback will receive two arguments: The original click event, and the OU that was clicked
     */
    onSelectClick: PropTypes.func,

    /**
     * onChangeCurrentRoot callback, which is triggered when the change current root label is clicked. Setting this also
     * enables the display of the change current root label
     *
     * the onChangeCurrentRoot callback will receive two arguments: The original click event, and the organisation unit
     * model object that was selected as the new root
     */
    onChangeCurrentRoot: PropTypes.func,

    /**
     * Organisation unit model representing the current root
     */
    currentRoot: PropTypes.object,

    /**
     * onChildrenLoaded callback, which is triggered when the children of this root org unit have been loaded
     *
     * The callback receives one argument: A D2 ModelCollection object that contains all the newly loaded org units
     */
    onChildrenLoaded: PropTypes.func,

    /**
     * Custom styling for OU labels
     */
    labelStyle: PropTypes.object,

    /**
     * Custom styling for trees
     */
    treeStyle: PropTypes.object,

    /**
     * Custom styling for the labels of selected OUs
     */
    selectedLabelStyle: PropTypes.object,

    /**
     * An array of organisation unit IDs that should be reloaded from the API
     */
    idsThatShouldBeReloaded: PropTypes.arrayOf(PropTypes.string),

    /**
     * Custom arrow symbol
     */
    arrowSymbol: PropTypes.string,

    /**
     * If true, don't display checkboxes next to org unit labels
     */
    hideCheckboxes: PropTypes.bool,

    /**
     * if true, don't display the selected member count next to org unit labels
     */
    hideMemberCount: PropTypes.bool,

    /**
     * Array of paths of Organisation Units to include on tree. If not defined or empty, all children from root to leafs will be shown
     */
    orgUnitsPathsToInclude: PropTypes.array,

    /**
     * If true `root.children.load` (a method on d2.ModelCollectionProperty) will be called with forceReload set to true, which is required
     * for dynamic OrgUnitTrees, i.e. in cases where parent-child relations are updated
     */
    forceReloadChildren: PropTypes.bool,

    /**
     * Results from search
     */
    searchResults: PropTypes.array,

    /**
     * Indicates if search results should be highlighted
     */
    highlightSearchResults: PropTypes.bool,

    /**
     * Indicates if showing folder icon is enabled
     */
    showFolderIcon: PropTypes.bool,

    /**
     * Prop indicating if spacer should be enabled
     */
    disableSpacer: PropTypes.bool,

    /**
     * Prop indicating checkbox color
     */
    checkboxColor: PropTypes.string,

    /**
     * Prop function invoked when user opens context menu against org unit
     */
    onContextMenuClick: PropTypes.func
};

OrgUnitTree.defaultProps = {
    displayNameProperty: 'displayName',
    selected: [],
    initiallyExpanded: [],
    onSelectClick: undefined,
    onContextMenuClick: undefined,
    onExpand: undefined,
    onCollapse: undefined,
    onChangeCurrentRoot: undefined,
    currentRoot: undefined,
    onChildrenLoaded: undefined,
    labelStyle: {},
    treeStyle: {},
    selectedLabelStyle: {},
    idsThatShouldBeReloaded: [],
    arrowSymbol: undefined,
    hideCheckboxes: false,
    hideMemberCount: false,
    orgUnitsPathsToInclude: null,
    forceReloadChildren: false,
    searchResults: [],
    highlightSearchResults: false,
    showFolderIcon: false,
    disableSpacer: false,
    checkboxColor: 'primary'
};

export default OrgUnitTree;