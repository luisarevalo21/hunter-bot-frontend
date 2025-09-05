import { RadioGroup, Radio } from "@heroui/react";
export default function Language({
  language,
  setLanguage,
  isDisabled,
}: {
  language: string;
  setLanguage: (lang: string) => void;
  isDisabled: boolean;
}) {
  let textLabel = "";
  if (language === "es") {
    textLabel = "Selecciona tu idioma";
  } else if (language === "zh") {
    textLabel = "选择您的语言";
  } else {
    textLabel = "Select your language";
  }

  return (
    <RadioGroup
      isDisabled={isDisabled}
      label={textLabel}
      // label="Select your language"
      orientation="horizontal"
      defaultValue="en"
      className="space-x-4 text-white text-center"
      value={language}
      onValueChange={setLanguage}
      classNames={{
        label: "text-white",
      }}
    >
      <Radio
        value="en"
        size="sm"
        classNames={{
          label: "text-white",
        }}
      >
        English
      </Radio>
      <Radio
        size="sm"
        value="es"
        classNames={{
          label: "text-white",
        }}
      >
        Español
      </Radio>
      <Radio
        value="zh"
        size="sm"
        classNames={{
          label: "text-white",
        }}
      >
        普通话
      </Radio>
    </RadioGroup>
  );
}
