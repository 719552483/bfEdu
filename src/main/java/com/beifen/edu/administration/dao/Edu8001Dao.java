package com.beifen.edu.administration.dao;

import com.beifen.edu.administration.domian.Edu8001;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


@Configuration
public interface Edu8001Dao extends JpaRepository<Edu8001, Long>, JpaSpecificationExecutor<Edu8001> {

    @Transactional
    @Modifying
    @Query(value = "delete from EDU8001 e where e.Edu8001_ID in ?1 ",nativeQuery = true)
    void deleteFinanceInfodetail(List<String> edu108IdList);
}
