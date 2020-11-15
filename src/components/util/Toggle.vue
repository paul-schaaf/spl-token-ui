<template>
  <label class="switch">
    <input
      :checked="checked"
      type="checkbox"
      @input="$emit('update:checked', $event.target.checked)"
    />
    <span class="slider round"></span>
  </label>
</template>

<script>
export default {
  emits: ["update:checked"],
  props: {
    checked: Boolean
  }
};
</script>

<style>
.switch {
  position: relative;
  display: inline-block;
  width: 45px;
  height: 24px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: white;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 17px;
  width: 17px;
  left: 3px;
  bottom: 3px;
  background-color: black;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

input:checked + .slider:before {
  -webkit-transform: translateX(22px);
  -ms-transform: translateX(22px);
  transform: translateX(22px);
}

.slider.round {
  border-radius: 4px;
}

.slider.round:before {
  border-radius: 25%;
}
</style>
