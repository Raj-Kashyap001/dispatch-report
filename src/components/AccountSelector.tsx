import CustomSelect from "./CustomSelect";

interface AccountSelectorProps {
  selectedAccount: string;
  accounts: string[];
  onAccountChange: (account: string) => void;
  onOpenModal: () => void;
}

const AccountSelector = ({
  selectedAccount,
  accounts,
  onAccountChange,
  onOpenModal,
}: AccountSelectorProps) => (
  <div className="account-bar">
    <label htmlFor="account-select">Account</label>
    <CustomSelect
      value={selectedAccount}
      options={accounts}
      onChange={onAccountChange}
    />
    <button className="manage-btn" onClick={onOpenModal}>
      <i className="fa-solid fa-gear" />
      Manage
    </button>
  </div>
);

export default AccountSelector;
