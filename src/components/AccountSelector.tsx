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
    <select
      id="account-select"
      className="flat-select"
      value={selectedAccount}
      onChange={(e) => onAccountChange(e.target.value)}
    >
      {accounts.map((a) => (
        <option key={a} value={a}>
          {a}
        </option>
      ))}
    </select>
    <button className="flat-btn" onClick={onOpenModal}>
      Manage
    </button>
  </div>
);

export default AccountSelector;
