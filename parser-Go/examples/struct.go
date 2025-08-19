package examples

type Personw struct {
	Name string
}

func argument_passing_reference_007_T(__taint_src string) {
	person := Personw{Name: "safe"}

	(&person).UpdateNamePointer(__taint_src)
	personName := (&person).GetNamePointer()
	__taint_sink(personName)
}

func (p *Personw) UpdateNamePointer(newName string) {
	p.Name = newName
}

func (p *Personw) GetNamePointer() string {
	return p.Name
}

func main() {
	argument_passing_reference_007_T("__taint_src")
}
