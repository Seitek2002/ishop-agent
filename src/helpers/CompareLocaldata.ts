interface Props {
  oldData: string;
  newData: any;
  localKey: string;
  setState: (data: string | number) => void;
}

export const CompareLocaldata = ({ oldData, newData, setState, localKey }: Props) => {
  if (oldData !== JSON.stringify(newData)) {
    setState(newData);
    localStorage.setItem(localKey, JSON.stringify(newData));
  }
};
