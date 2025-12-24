const React = require('react');

function make(name) {
  return function MockComponent(props) {
    return React.createElement('div', { 'data-mock-component': name }, props && props.children);
  };
}

exports.GdsGrid = make('GdsGrid');
exports.GdsFlex = make('GdsFlex');
exports.GdsDiv = make('GdsDiv');
exports.GdsCard = make('GdsCard');
exports.GdsDivider = make('GdsDivider');
exports.GdsTheme = make('GdsTheme');
exports.GdsText = make('GdsText');
exports.GdsInput = make('GdsInput');
exports.GdsTextarea = make('GdsTextarea');
exports.GdsCheckbox = make('GdsCheckbox');
exports.GdsRadioGroup = make('GdsRadioGroup');
exports.GdsSelect = make('GdsSelect');
exports.GdsDropdown = make('GdsDropdown');
exports.GdsDatepicker = make('GdsDatepicker');
exports.GdsButton = make('GdsButton');
exports.GdsLink = make('GdsLink');
exports.GdsFab = make('GdsFab');
exports.GdsMenuButton = make('GdsMenuButton');
exports.GdsFilterChips = make('GdsFilterChips');
exports.GdsFilterChip = make('GdsFilterChip');
exports.GdsSegmentedControl = make('GdsSegmentedControl');
exports.GdsAlert = make('GdsAlert');
exports.GdsBadge = make('GdsBadge');
exports.GdsSpinner = make('GdsSpinner');
exports.GdsSignal = make('GdsSignal');
exports.GdsCoachmark = make('GdsCoachmark');
exports.GdsDialog = make('GdsDialog');
exports.GdsPopover = make('GdsPopover');
exports.GdsContextMenu = make('GdsContextMenu');
exports.GdsBreadcrumbs = make('GdsBreadcrumbs');
exports.GdsFormSummary = make('GdsFormSummary');
exports.GdsGroupedList = make('GdsGroupedList');
exports.GdsDetails = make('GdsDetails');
exports.GdsImg = make('GdsImg');
exports.GdsVideo = make('GdsVideo');
exports.GdsRichText = make('GdsRichText');
exports.GdsMask = make('GdsMask');
exports.GdsBlur = make('GdsBlur');
exports.GdsFormattedNumber = make('GdsFormattedNumber');
exports.GdsFormattedDate = make('GdsFormattedDate');
exports.GdsFormattedAccount = make('GdsFormattedAccount');
exports.GdsSensitiveNumber = make('GdsSensitiveNumber');
exports.GdsSensitiveDate = make('GdsSensitiveDate');
exports.GdsSensitiveAccount = make('GdsSensitiveAccount');
exports.GdsCalendar = make('GdsCalendar');
