class User {

    public string $name = 'tsiory';
    public Email $mail;


public function __constructor(string $name, Email $mail){
        $this->name = $name;
        $this->mail = mail;
}
}


$user = new User();