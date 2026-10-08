import { useState } from "react";

import Button from "../ui/Button";
import Drawer from "../ui/Drawer";
import { Checkbox, Field, Input, Select, Textarea } from "../ui/Field";

function initialValues(fields, record) {
  const values = {};

  for (const field of fields) {
    const current = record?.[field.name];

    if (field.type === "checkbox") {
      values[field.name] = Boolean(current ?? field.defaultValue ?? false);
      continue;
    }

    values[field.name] = current ?? field.defaultValue ?? "";
  }

  return values;
}

function validate(fields, values) {
  const errors = {};

  for (const field of fields) {
    if (field.type === "checkbox") continue;

    const text = String(values[field.name] ?? "").trim();

    if (text === "") {
      if (field.required) errors[field.name] = `${field.label} is required`;
      continue;
    }

    if (field.pattern && !field.pattern.test(text)) {
      errors[field.name] = field.patternMessage ?? `${field.label} is not valid`;
      continue;
    }

    const message = field.check?.(text, values);

    if (message) errors[field.name] = message;
  }

  return errors;
}

/** Numbers become numbers; everything else is trimmed to a string. */
function coerce(fields, values) {
  const output = {};

  for (const field of fields) {
    const value = values[field.name];

    if (field.type === "checkbox") output[field.name] = Boolean(value);
    else if (field.type === "number")
      output[field.name] = value === "" ? null : Number(value);
    else output[field.name] = String(value ?? "").trim();
  }

  return output;
}

/** Create / edit form rendered in a right-hand drawer. */
export default function RecordForm({
  fields,
  record,
  title,
  description,
  submitLabel,
  onSubmit,
  onClose,
}) {
  // Mounted only while open, so mounting is what seeds the form.
  const [values, setValues] = useState(() => initialValues(fields, record));
  const [errors, setErrors] = useState({});

  const setValue = (name, value) => {
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) =>
      current[name] ? { ...current, [name]: undefined } : current
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextErrors = validate(fields, values);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    onSubmit(coerce(fields, values));
  };

  const control = (field) => {
    const id = `field-${field.name}`;
    const invalid = Boolean(errors[field.name]);
    const set = (value) => setValue(field.name, value);

    if (field.type === "select") {
      return (
        <Select
          id={id}
          invalid={invalid}
          value={values[field.name] ?? ""}
          onChange={(event) => set(event.target.value)}
        >
          {(field.options ?? []).map((option) => {
            // Plain strings double as value and label; { value, label } pairs
            // let a form show "Student" while storing "user".
            const value = typeof option === "object" ? option.value : option;
            const label = typeof option === "object" ? option.label : option;

            return (
              <option key={value} value={value}>
                {label}
              </option>
            );
          })}
        </Select>
      );
    }

    if (field.type === "textarea") {
      return (
        <Textarea
          id={id}
          rows={field.rows ?? 3}
          invalid={invalid}
          placeholder={field.placeholder}
          value={values[field.name] ?? ""}
          onChange={(event) => set(event.target.value)}
        />
      );
    }

    return (
      <Input
        id={id}
        min={field.min}
        max={field.max}
        step={field.step}
        invalid={invalid}
        placeholder={field.placeholder}
        value={values[field.name] ?? ""}
        type={
          field.type === "number"
            ? "number"
            : field.type === "date"
              ? "date"
              : field.type === "password"
                ? "password"
                : "text"
        }
        onChange={(event) => set(event.target.value)}
      />
    );
  };

  return (
    <Drawer
      open
      onClose={onClose}
      width="lg"
      title={title}
      description={description}
      footer={
        <div className="flex items-center justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>

          <Button type="submit" form="record-form">
            {submitLabel}
          </Button>
        </div>
      }
    >
      <form
        id="record-form"
        noValidate
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2"
      >
        {fields.map((field) =>
          field.type === "checkbox" ? (
            <div key={field.name} className={field.wide ? "sm:col-span-2" : ""}>
              <Checkbox
                id={`field-${field.name}`}
                label={field.checkboxLabel ?? field.label}
                checked={Boolean(values[field.name])}
                onChange={(event) => setValue(field.name, event.target.checked)}
              />
            </div>
          ) : (
            <Field
              key={field.name}
              label={field.label}
              required={field.required}
              hint={field.hint}
              error={errors[field.name]}
              htmlFor={`field-${field.name}`}
              className={field.wide ? "sm:col-span-2" : ""}
            >
              {control(field)}
            </Field>
          )
        )}
      </form>
    </Drawer>
  );
}
